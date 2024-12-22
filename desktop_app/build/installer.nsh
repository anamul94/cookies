!macro customHeader
  RequestExecutionLevel user
!macroend

!macro customInstall
  WriteRegStr HKCU "Software\Cookie Manager" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Cookie Manager" "Version" "${VERSION}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "Publisher" "Cookie Manager Team"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "URLInfoAbout" "https://cookiemanager.com"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "HelpLink" "https://cookiemanager.com/support"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "DisplayVersion" "${VERSION}"
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Cookie Manager"
!macroend
