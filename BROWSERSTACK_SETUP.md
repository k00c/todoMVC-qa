# BrowserStack Setup Guide

## Security Notice

**NEVER commit your BrowserStack credentials to git!** Always use environment variables.

## Setup Steps

### 1. Get Your BrowserStack Credentials

1. Sign up or log in to [BrowserStack](https://www.browserstack.com/)
2. Go to Settings → Access Keys
3. Copy your **Username** and **Access Key**

### 2. Set Environment Variables

**On Linux/Mac (bash/zsh):**

```bash
export BROWSERSTACK_USERNAME=your_username
export BROWSERSTACK_ACCESS_KEY=your_access_key
```

Add these to your `~/.bashrc` or `~/.zshrc` to make them persistent.

**On Windows (PowerShell):**

```powershell
$env:BROWSERSTACK_USERNAME="your_username"
$env:BROWSERSTACK_ACCESS_KEY="your_access_key"
```

**On Windows (Git Bash):**

```bash
export BROWSERSTACK_USERNAME=your_username
export BROWSERSTACK_ACCESS_KEY=your_access_key
```

**Alternative: Use .env file (local development only):**

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
# .env is in .gitignore and will NOT be committed
```

### 3. Verify Setup

Run this command to verify your environment variables are set:

```bash
echo $BROWSERSTACK_USERNAME
echo $BROWSERSTACK_ACCESS_KEY
```

Both should display your credentials (username will be visible, access key should show).

### 4. Run Tests with BrowserStack

```bash
# The browserstack.yml file will automatically use environment variables
npx browserstack-node-sdk playwright test --project=chromium
```

## GitHub Actions / CI Setup

For GitHub Actions, add your credentials as **repository secrets**:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add two secrets:
   - `BROWSERSTACK_USERNAME` = your username
   - `BROWSERSTACK_ACCESS_KEY` = your access key

Then in your workflow file:

```yaml
env:
  BROWSERSTACK_USERNAME: ${{ secrets.BROWSERSTACK_USERNAME }}
  BROWSERSTACK_ACCESS_KEY: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
```

## Security Best Practices

- ✅ **DO**: Use environment variables
- ✅ **DO**: Use `.env` files (ignored by git)
- ✅ **DO**: Add credentials as CI/CD secrets
- ✅ **DO**: Regenerate keys if accidentally committed

- ❌ **DON'T**: Commit credentials to git
- ❌ **DON'T**: Share access keys in public channels
- ❌ **DON'T**: Push credentials to GitHub
- ❌ **DON'T**: Include credentials in screenshots or documentation

## What to Do If You Accidentally Commit Credentials

1. **Immediately regenerate** your BrowserStack access key
2. Remove credentials from files and use environment variables
3. Rewrite git history to remove the commit
4. Force-push to overwrite remote history
5. Verify the credentials no longer appear in GitHub

See GitHub's guide: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
