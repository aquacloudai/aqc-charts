# Release Process

This document outlines the release process for `@aquacloud_ai/aqc-charts`.

## Prerequisites

1. **NPM Token**: Ensure the `NPM_TOKEN` secret is set in GitHub repository secrets with access to the `aquacloud_ai` organization
2. **Permissions**: Token must have publish permissions for scoped packages

## Release Steps

### 1. Prepare Release

```bash
# Ensure you're on main branch and up to date
git checkout main
git pull origin main

# Run tests and build to ensure everything works
bun run test
bun run build
bun run typecheck
bun run lint
```

### 2. Version Bump

Update the version in `package.json`:

```bash
# For patch release (0.1.0 -> 0.1.1)
npm version patch

# For minor release (0.1.0 -> 0.2.0)  
npm version minor

# For major release (0.1.0 -> 1.0.0)
npm version major
```

This will:
- Update `package.json` version
- Create a git tag
- Commit the version change

### 3. Push Release

```bash
# Push the version commit and tag
git push origin main --tags
```

### 4. Automated Release

The GitHub Actions workflow will automatically:
- ✅ Run tests
- ✅ Build the library
- ✅ Publish to NPM as `@aquacloud_ai/aqc-charts`
- ✅ Create GitHub release with auto-generated notes

## Manual Release (if needed)

If you need to publish manually:

```bash
# Build first
bun run build

# Publish to NPM
npm publish
```

## Package Information

- **NPM Package**: `@aquacloud_ai/aqc-charts`
- **Organization**: `aquacloud_ai`
- **Registry**: `https://registry.npmjs.org/`
- **Access**: Public

## Installation

Users can install the package with:

```bash
npm install @aquacloud_ai/aqc-charts
# or
yarn add @aquacloud_ai/aqc-charts
# or
bun add @aquacloud_ai/aqc-charts
```

## Troubleshooting

### NPM Token Issues
- Verify token has correct permissions for `aquacloud_ai` organization
- Ensure token is set in GitHub repository secrets as `NPM_TOKEN`

### Build Failures
- Check all tests pass: `bun run test`
- Verify TypeScript compilation: `bun run typecheck`
- Ensure build succeeds: `bun run build`

### Publishing Errors
- Verify package name availability on NPM
- Check `.npmrc` configuration
- Ensure version hasn't already been published