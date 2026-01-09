# GitHub CI/CD Setup Guide

## Overview

This repository is configured with a GitHub Actions workflow that automatically:
1. Builds binaries for Windows, Linux, and macOS (Intel & Apple Silicon)
2. Creates a GitHub Release with all binaries attached
3. Auto-increments the version number on each push to main
4. Commits the version bump back to the repository

## Setup Instructions

### 1. Configure GitHub Repository Secrets

The workflow uses `GITHUB_TOKEN` which is automatically provided by GitHub Actions. No additional secrets are needed.

However, ensure your repository has:
- **Settings** → **Actions** → **General** → **Workflow permissions**
  - Enable "Read and write permissions" for workflow permissions
  - Enable "Allow GitHub Actions to create and approve pull requests"

### 2. Initial Setup

1. Push your code to GitHub (if not already done)
2. The workflow will trigger automatically on the first push to `main`
3. It will create release `v1.0.1` (assuming your package.json starts at `1.0.0`)

### 3. How It Works

#### Triggering Builds

**Automatic (Default):**
- Push any changes to the `main` branch
- The workflow runs automatically
- Creates a new release with incremented version

**Manual:**
- Go to **Actions** tab in GitHub
- Select "Build and Release" workflow
- Click "Run workflow" button
- Choose branch and click "Run workflow"

#### Version Incrementing

- Reads version from `package.json` (e.g., `1.0.0`)
- Increments the patch version (e.g., `1.0.0` → `1.0.1`)
- Updates `package.json` and `package-lock.json`
- Commits the change with message: `chore: bump version to v1.0.1`
- Pushes the commit back to `main`

#### Build Platforms

| Platform | Output File | Architecture |
|----------|-------------|--------------|
| Windows | `cody-oai-router.exe` | x64 |
| Linux | `cody-oai-router-linux` | x64 |
| macOS Intel | `cody-oai-router-macos-intel` | x64 |
| macOS Apple Silicon | `cody-oai-router-macos-arm64` | ARM64 |

#### Release Creation

- Creates a new release with tag `v{version}`
- Uploads all 4 binaries as release assets
- Includes release notes with download instructions
- Comments on the commit that triggered the release

## Workflow Steps

1. **Checkout Code**: Clones the repository
2. **Setup Node.js**: Installs Node.js 18
3. **Install Dependencies**: Runs `npm ci`
4. **Build Binaries**: Builds all 4 platforms in parallel
5. **Upload Artifacts**: Stores binaries as GitHub artifacts
6. **Create Release**: Creates GitHub release with binaries
7. **Version Bump**: Increments version in package.json
8. **Commit & Push**: Commits and pushes version change

## Workflow Files

- `.github/workflows/build-release.yml` - Main workflow definition
- Triggers on: push to `main` branch or manual trigger

## Customization

### Change Version Increment Pattern

Edit the "Increment version" step in `.github/workflows/build-release.yml`:

```bash
# Current: Increments patch version (1.0.0 → 1.0.1)
PATCH=$((PATCH + 1))

# To increment minor version (1.0.0 → 1.1.0)
MINOR=$((MINOR + 1))
PATCH=0

# To increment major version (1.0.0 → 2.0.0)
MAJOR=$((MAJOR + 1))
MINOR=0
PATCH=0
```

### Add More Build Platforms

Add to the matrix in `.github/workflows/build-release.yml`:

```yaml
- os: alpine
  target: node18-alpine-x64
  output: cody-oai-router-alpine
```

### Modify Release Notes

Edit the `body` section in the "Create Release" step to customize release notes.

## Monitoring Builds

1. Go to the **Actions** tab in your GitHub repository
2. Click on the "Build and Release" workflow
3. View the status of each run
4. Download artifacts if needed (before release is created)

## Troubleshooting

### Workflow Fails on Permission Error

Check repository settings:
- Settings → Actions → General
- Ensure "Workflow permissions" is set to "Read and write permissions"

### Version Not Incrementing

Check that:
- `package.json` has a valid version number
- The workflow has write permissions
- There are no merge conflicts on `main` branch

### Release Not Created

Check that:
- The workflow completed successfully
- No errors in the "Create Release" step
- `GITHUB_TOKEN` has `contents: write` permission

### Build Fails for Specific Platform

Check that:
- Node.js 18 supports the target platform
- pkg supports the target architecture
- No syntax errors in the code

## Examples

### Manual Release for Specific Version

If you want to create a release for a specific version (e.g., v2.0.0):

1. Update `package.json` version to `2.0.0`
2. Commit and push to `main`
3. The workflow will create v2.0.0 release
4. Next push will create v2.0.1 (increments from 2.0.0)

### Skip Release for a Push

If you want to push changes without creating a release:

1. Push to a different branch (e.g., `dev`, `feature-branch`)
2. Only `main` branch triggers releases

### Test Workflow Locally

To test the build process locally:

```bash
# Install dependencies
npm install

# Build all platforms
npm run build:all

# Binaries will be in dist/
ls -la dist/
```

## Best Practices

1. **Review Release Notes**: Edit the release notes after creation if needed
2. **Tag Important Releases**: Consider marking major releases (e.g., v2.0.0) as "Latest release"
3. **Monitor Build Time**: The workflow takes ~5-10 minutes to complete
4. **Keep Changelog**: Document major changes in README or CHANGELOG.md
5. **Test Binaries**: Download and test binaries from releases before sharing

## Support

For issues with the CI/CD workflow:
1. Check the **Actions** tab for error logs
2. Review the workflow file syntax
3. Ensure repository permissions are correct
4. Check GitHub Actions status pages for outages
