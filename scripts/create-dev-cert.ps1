$ErrorActionPreference = 'Stop'

$certDir = Join-Path $PSScriptRoot '..\certs'
$keyPath = Join-Path $certDir 'localhost-key.pem'
$certPath = Join-Path $certDir 'localhost-cert.pem'

function ConvertTo-PemBlock {
  param(
    [string]$Label,
    [byte[]]$Bytes
  )

  $base64 = [System.Convert]::ToBase64String($Bytes)
  $lines = for ($offset = 0; $offset -lt $base64.Length; $offset += 64) {
    $length = [System.Math]::Min(64, $base64.Length - $offset)
    $base64.Substring($offset, $length)
  }

  @(
    "-----BEGIN $Label-----"
    $lines
    "-----END $Label-----"
  ) -join [Environment]::NewLine
}

function Write-DerLength {
  param(
    [System.Collections.Generic.List[byte]]$Bytes,
    [int]$Length
  )

  if ($Length -lt 128) {
    $Bytes.Add([byte]$Length)
    return
  }

  $lengthBytes = New-Object System.Collections.Generic.List[byte]
  while ($Length -gt 0) {
    $lengthBytes.Insert(0, [byte]($Length -band 0xff))
    $Length = $Length -shr 8
  }

  $Bytes.Add([byte](0x80 -bor $lengthBytes.Count))
  $Bytes.AddRange($lengthBytes)
}

function Write-DerInteger {
  param(
    [System.Collections.Generic.List[byte]]$Bytes,
    [byte[]]$Value
  )

  $offset = 0
  while ($offset -lt ($Value.Length - 1) -and $Value[$offset] -eq 0) {
    $offset++
  }

  $clean = $Value[$offset..($Value.Length - 1)]
  if (($clean[0] -band 0x80) -ne 0) {
    $clean = @([byte]0) + $clean
  }

  $Bytes.Add(0x02)
  Write-DerLength $Bytes $clean.Length
  $Bytes.AddRange([byte[]]$clean)
}

function Export-RsaPrivateKeyDer {
  param([System.Security.Cryptography.RSA]$Rsa)

  $parameters = $Rsa.ExportParameters($true)
  $body = New-Object System.Collections.Generic.List[byte]
  Write-DerInteger $body ([byte[]](0))
  Write-DerInteger $body $parameters.Modulus
  Write-DerInteger $body $parameters.Exponent
  Write-DerInteger $body $parameters.D
  Write-DerInteger $body $parameters.P
  Write-DerInteger $body $parameters.Q
  Write-DerInteger $body $parameters.DP
  Write-DerInteger $body $parameters.DQ
  Write-DerInteger $body $parameters.InverseQ

  $der = New-Object System.Collections.Generic.List[byte]
  $der.Add(0x30)
  Write-DerLength $der $body.Count
  $der.AddRange($body)
  [byte[]]$der.ToArray()
}

New-Item -ItemType Directory -Force -Path $certDir | Out-Null

$rsa = [System.Security.Cryptography.RSA]::Create(2048)
$subject = [System.Security.Cryptography.X509Certificates.X500DistinguishedName]::new('CN=localhost')
$request = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
  $subject,
  $rsa,
  [System.Security.Cryptography.HashAlgorithmName]::SHA256,
  [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
)

$sanBuilder = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
$sanBuilder.AddDnsName('localhost')
$sanBuilder.AddIpAddress([System.Net.IPAddress]::Parse('127.0.0.1'))
$sanBuilder.AddIpAddress([System.Net.IPAddress]::Parse('::1'))
$request.CertificateExtensions.Add($sanBuilder.Build())
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $false)
)
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature -bor
      [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyEncipherment,
    $false
  )
)
$eku = [System.Security.Cryptography.OidCollection]::new()
$eku.Add([System.Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.1', 'Server Authentication')) | Out-Null
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension]::new($eku, $false)
)

$notBefore = [System.DateTimeOffset]::Now.AddDays(-1)
$notAfter = $notBefore.AddYears(2)
$certificate = $request.CreateSelfSigned($notBefore, $notAfter)

$keyPem = ConvertTo-PemBlock 'RSA PRIVATE KEY' (Export-RsaPrivateKeyDer $rsa)
$certPem = ConvertTo-PemBlock 'CERTIFICATE' ($certificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert))

Set-Content -Path $keyPath -Value $keyPem -Encoding ascii
Set-Content -Path $certPath -Value $certPem -Encoding ascii

Write-Host "Created $keyPath"
Write-Host "Created $certPath"
