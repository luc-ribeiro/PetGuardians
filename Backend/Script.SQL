Build started...
Build succeeded.
info: Microsoft.EntityFrameworkCore.Infrastructure[10403]
      Entity Framework Core 6.0.10 initialized 'DBPetGuardians' using provider 'Microsoft.EntityFrameworkCore.SqlServer:6.0.10' with options: None
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Persons] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(60) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
    [Telephone] nvarchar(11) NOT NULL,
    [GCG] nvarchar(14) NOT NULL,
    [CEP] nvarchar(8) NOT NULL,
    [UF] nvarchar(2) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
    [City] nvarchar(max) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
    [Street] nvarchar(max) NOT NULL,
    [StreetNumber] nvarchar(max) NOT NULL,
    [District] nvarchar(max) NOT NULL,
    [Complement] nvarchar(max) NOT NULL,
    [Created] datetime2 NOT NULL,
    [Active] bit NOT NULL,
    [Email] nvarchar(450) NOT NULL,
    [ProfilePicture] nvarchar(max) NOT NULL,
    [ProfilePictureMimeType] nvarchar(max) NOT NULL,
    [RegType] nvarchar(1) NOT NULL,
    [PasswordHash] varbinary(max) NOT NULL,
    [PasswordSalt] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Persons] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Donors] (
    [Id] int NOT NULL,
    [Birthday] datetime2 NOT NULL,
    CONSTRAINT [PK_Donors] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Donors_Persons_Id] FOREIGN KEY ([Id]) REFERENCES [Persons] ([Id])
);
GO

CREATE TABLE [Images] (
    [Id] int NOT NULL IDENTITY,
    [Base64] nvarchar(max) NOT NULL,
    [MimeType] nvarchar(max) NOT NULL,
    [Size] real NOT NULL,
    [PersonId] int NOT NULL,
    CONSTRAINT [PK_Images] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Images_Persons_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Partners] (
    [Id] int NOT NULL,
    [FantasyName] nvarchar(max) NOT NULL,
    [LinkSite] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Partners] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Partners_Persons_Id] FOREIGN KEY ([Id]) REFERENCES [Persons] ([Id])
);
GO

CREATE TABLE [RefreshTokens] (
    [PersonId] int NOT NULL,
    [Token] nvarchar(max) NOT NULL,
    [Created] datetime2 NOT NULL,
    [Expires] datetime2 NOT NULL,
    CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([PersonId]),
    CONSTRAINT [FK_RefreshTokens_Persons_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Shelters] (
    [Id] int NOT NULL,
    [FantasyName] nvarchar(60) NOT NULL,
    [KeyPIX] nvarchar(max) NOT NULL,
    [About] nvarchar(max) NULL,
    CONSTRAINT [PK_Shelters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Shelters_Persons_Id] FOREIGN KEY ([Id]) REFERENCES [Persons] ([Id])
);
GO

CREATE TABLE [Coupons] (
    [Id] int NOT NULL IDENTITY,
    [Code] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [Active] bit NOT NULL,
    [PartnerId] int NOT NULL,
    CONSTRAINT [PK_Coupons] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Coupons_Partners_PartnerId] FOREIGN KEY ([PartnerId]) REFERENCES [Partners] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Donations] (
    [Id] int NOT NULL IDENTITY,
    [CreatedAt] datetime2 NOT NULL,
    [Value] int NOT NULL,
    [Confirmed] bit NOT NULL,
    [KeyPix] nvarchar(max) NOT NULL,
    [DonorId] int NOT NULL,
    [ShelterId] int NOT NULL,
    CONSTRAINT [PK_Donations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Donations_Donors_DonorId] FOREIGN KEY ([DonorId]) REFERENCES [Donors] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Donations_Shelters_ShelterId] FOREIGN KEY ([ShelterId]) REFERENCES [Shelters] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Coupons_PartnerId] ON [Coupons] ([PartnerId]);
GO

CREATE INDEX [IX_Donations_DonorId] ON [Donations] ([DonorId]);
GO

CREATE INDEX [IX_Donations_ShelterId] ON [Donations] ([ShelterId]);
GO

CREATE INDEX [IX_Images_PersonId] ON [Images] ([PersonId]);
GO

CREATE UNIQUE INDEX [IX_Persons_Email] ON [Persons] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Persons_GCG] ON [Persons] ([GCG]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20221124025807_init', N'6.0.10');
GO

COMMIT;
GO


