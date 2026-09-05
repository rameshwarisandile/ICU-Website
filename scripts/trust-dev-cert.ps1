$ErrorActionPreference = 'Stop'

$certPath = Join-Path $PSScriptRoot '..\certs\localhost-cert.pem'

if (-not (Test-Path $certPath)) {
  throw "Certificate not found at $certPath. Run scripts/create-dev-cert.ps1 first."
}

Import-Certificate -FilePath $certPath -CertStoreLocation Cert:\CurrentUser\Root | Out-Null

Write-Host "Trusted local development certificate for the current Windows user."
Write-Host "Restart the browser if it already had the HTTPS page open."
