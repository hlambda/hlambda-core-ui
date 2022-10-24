# Release 0.1.0

- Added custom build of vscode for code editor instead of monaco editor
- Added clear cache option in settings
- Added difference between hard reset and zero downtime reload (Main reload button now triggers reload)
- Added hard reset button in settings (Forces the backend to exit with code 0)

# Release 0.0.5

- Fixed noopener rel to Login
- Added env banner component to UI
- Added version banner component to UI
- Update Errors and Constants to use ReadOnly Monaco Editor
- Add current version to App Bar
- Added Settings
- Added Documentation
- Added News

# Release 0.0.4

- Added CHANGELOG.md
- Fix issue with JSON invalid values in the console:admin token in local storage (Hlambd UI)
  Example: `demo` instead `"demo"`
- Pull the version of the package from package.json
- Update manifest.json
- Add better versioning to the build process and yarn start
- Add github actions for testing and building react artefacts and deploying them to the CDN
