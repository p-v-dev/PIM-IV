#ifndef AppVersion
  #error Pass /DAppVersion=1.2.3 (without the v prefix).
#endif
#ifndef PublishDir
  #error Pass /DPublishDir with the absolute .NET publish directory.
#endif
#ifndef OutputDir
  #error Pass /DOutputDir with the absolute installer output directory.
#endif

#define AppName "EduQuest Admin"
#define AppExe "EduQuest.Admin.Desktop.exe"

[Setup]
AppId=EduQuest.Admin.Desktop
AppName={#AppName}
AppVersion={#AppVersion}
DefaultDirName={localappdata}\Programs\{#AppName}
UninstallDisplayIcon={app}\{#AppExe}
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir={#OutputDir}
OutputBaseFilename=EduQuest-Admin-Windows-x64

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; Flags: unchecked

[Files]
Source: "{#AddBackslash(PublishDir)}appsettings.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#AddBackslash(PublishDir)}*"; Excludes: "\appsettings.json"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{userprograms}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{userdesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon
