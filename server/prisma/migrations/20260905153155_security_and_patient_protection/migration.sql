/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `patient` ADD COLUMN `billingLocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deathDateTime` DATETIME(3) NULL,
    ADD COLUMN `statusReason` VARCHAR(191) NULL,
    ADD COLUMN `statusUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('ADMITTED', 'ICU', 'STABLE', 'CRITICAL', 'RECOVERING', 'DISCHARGED', 'DECEASED') NOT NULL DEFAULT 'ADMITTED';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'DOCTOR', 'NURSE', 'BILLING_STAFF', 'PATIENT', 'ANALYST') NOT NULL DEFAULT 'DOCTOR';

-- CreateTable
CREATE TABLE `PatientStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `previousStatus` ENUM('ADMITTED', 'ICU', 'STABLE', 'CRITICAL', 'RECOVERING', 'DISCHARGED', 'DECEASED') NULL,
    `status` ENUM('ADMITTED', 'ICU', 'STABLE', 'CRITICAL', 'RECOVERING', 'DISCHARGED', 'DECEASED') NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `performedByUserId` VARCHAR(191) NULL,
    `performedByRole` ENUM('ADMIN', 'DOCTOR', 'NURSE', 'BILLING_STAFF', 'PATIENT', 'ANALYST') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PatientStatusHistory_patientId_createdAt_idx`(`patientId`, `createdAt`),
    INDEX `PatientStatusHistory_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeathRecord` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `declaredAt` DATETIME(3) NOT NULL,
    `verifiedAt` DATETIME(3) NULL,
    `declaredByUserId` VARCHAR(191) NULL,
    `verifiedByUserId` VARCHAR(191) NULL,
    `declaredByRole` ENUM('ADMIN', 'DOCTOR', 'NURSE', 'BILLING_STAFF', 'PATIENT', 'ANALYST') NOT NULL,
    `verifiedByRole` ENUM('ADMIN', 'DOCTOR', 'NURSE', 'BILLING_STAFF', 'PATIENT', 'ANALYST') NULL,
    `causeOfDeath` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DeathRecord_patientId_key`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillingEntry` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `serviceCategory` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'POSTED', 'PAID', 'VOIDED', 'REFUNDED', 'ADJUSTED') NOT NULL DEFAULT 'PENDING',
    `createdByUserId` VARCHAR(191) NULL,
    `updatedByUserId` VARCHAR(191) NULL,
    `serviceDateTime` DATETIME(3) NOT NULL,
    `billedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `voidedAt` DATETIME(3) NULL,
    `refundReason` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BillingEntry_patientId_billedAt_idx`(`patientId`, `billedAt`),
    INDEX `BillingEntry_status_billedAt_idx`(`status`, `billedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillingAuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `billingEntryId` VARCHAR(191) NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `details` JSON NULL,
    `wasBlocked` BOOLEAN NOT NULL DEFAULT false,
    `createdByUserId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BillingAuditLog_patientId_createdAt_idx`(`patientId`, `createdAt`),
    INDEX `BillingAuditLog_action_createdAt_idx`(`action`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientCareEntry` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `entryType` ENUM('MEDICINE', 'TREATMENT', 'LAB', 'NOTE') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NOT NULL,
    `visibleToPatient` BOOLEAN NOT NULL DEFAULT true,
    `createdByUserId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PatientCareEntry_patientId_createdAt_idx`(`patientId`, `createdAt`),
    INDEX `PatientCareEntry_entryType_createdAt_idx`(`entryType`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_userId_key` ON `Patient`(`userId`);

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientStatusHistory` ADD CONSTRAINT `PatientStatusHistory_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientStatusHistory` ADD CONSTRAINT `PatientStatusHistory_performedByUserId_fkey` FOREIGN KEY (`performedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeathRecord` ADD CONSTRAINT `DeathRecord_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeathRecord` ADD CONSTRAINT `DeathRecord_declaredByUserId_fkey` FOREIGN KEY (`declaredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeathRecord` ADD CONSTRAINT `DeathRecord_verifiedByUserId_fkey` FOREIGN KEY (`verifiedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingEntry` ADD CONSTRAINT `BillingEntry_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingEntry` ADD CONSTRAINT `BillingEntry_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingEntry` ADD CONSTRAINT `BillingEntry_updatedByUserId_fkey` FOREIGN KEY (`updatedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingAuditLog` ADD CONSTRAINT `BillingAuditLog_billingEntryId_fkey` FOREIGN KEY (`billingEntryId`) REFERENCES `BillingEntry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingAuditLog` ADD CONSTRAINT `BillingAuditLog_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingAuditLog` ADD CONSTRAINT `BillingAuditLog_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientCareEntry` ADD CONSTRAINT `PatientCareEntry_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientCareEntry` ADD CONSTRAINT `PatientCareEntry_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
