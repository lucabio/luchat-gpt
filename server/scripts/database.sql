-- Create the DocAlli database
CREATE DATABASE DocAlli;
GO

USE DocAlli;
GO

-- Create Users table with reference to Cognito User ID
CREATE TABLE Users (
    CognitoUserID NVARCHAR(255) PRIMARY KEY,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Email NVARCHAR(100) NOT NULL UNIQUE,
    DateOfBirth DATE,
    AdditionalData NVARCHAR(MAX), -- Or any other application-specific fields
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Create Roles table
CREATE TABLE Roles (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Create Permissions table
CREATE TABLE Permissions (
    PermissionID INT IDENTITY(1,1) PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- Association table between Users and Roles
CREATE TABLE UserRoles (
    CognitoUserID NVARCHAR(255) FOREIGN KEY REFERENCES Users(CognitoUserID),
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    PRIMARY KEY (CognitoUserID, RoleID)
);
GO

-- Association table between Roles and Permissions
CREATE TABLE RolePermissions (
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    PermissionID INT FOREIGN KEY REFERENCES Permissions(PermissionID),
    PRIMARY KEY (RoleID, PermissionID)
);
GO

CREATE TABLE FileUploads (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CognitoUserID NVARCHAR(255) NOT NULL,
    S3Url VARCHAR(255) NOT NULL,
    FOREIGN KEY (CognitoUserID) REFERENCES Users(CognitoUserID)
);
GO

CREATE TABLE Threads (
    CognitoUserID NVARCHAR(255) NOT NULL,
    ThreadsId NVARCHAR(255) NOT NULL,
    PRIMARY KEY (ThreadsId),
    FOREIGN KEY (CognitoUserID) REFERENCES Users(CognitoUserID)
);
GO

CREATE TABLE Assistants (
    CognitoUserID NVARCHAR(255) NOT NULL,
    AssistantsId NVARCHAR(255) NOT NULL,
    PRIMARY KEY (AssistantsId),
    FOREIGN KEY (CognitoUserID) REFERENCES Users(CognitoUserID)
);
GO

CREATE TABLE CognitoTokens (
    CognitoUserID NVARCHAR(255) NOT NULL,
    RefreshTokens NVARCHAR(255) NOT NULL,
    PRIMARY KEY (AssistantsId),
    FOREIGN KEY (CognitoUserID) REFERENCES Users(CognitoUserID)
);
GO

CREATE TABLE UserTokens (
    CognitoUserID NVARCHAR(255) NOT NULL,
	AccessToken NVARCHAR(MAX) NOT NULL,
    RefreshToken NVARCHAR(MAX) NOT NULL,
    PRIMARY KEY (CognitoUserID),
    FOREIGN KEY (CognitoUserID) REFERENCES Users(CognitoUserID)
);
GO





