# Deploy Amplify Backend Instructions

## Why You're Getting 500 Errors

Your `amplify_outputs.json` has Cognito IDs, but the actual backend resources don't exist in AWS. You need to deploy your backend defined in `amplify/` folder.

## Option 1: Deploy via AWS Console (EASIEST)

1. Go to https://console.aws.amazon.com/amplify/
2. Select your app
3. Click **"Backend"** tab
4. Click **"Set up backend"** or **"Deploy backend"**
5. Select branch: `main`
6. Click **"Deploy"**
7. Wait 5-10 minutes for backend to deploy
8. Download the new `amplify_outputs.json` and replace your local file
9. Commit and push the new file
10. Redeploy your frontend

## Option 2: Deploy via CLI

### 1. Configure AWS Credentials

```bash
aws configure
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Region: `us-east-1`
- Output format: `json`

### 2. Deploy Sandbox (for testing)

```bash
cd /Users/abhishek.bansal/Desktop/my-amplify-app
npx ampx sandbox
```

This will:
- Create Cognito User Pool
- Generate amplify_outputs.json
- Keep resources running while sandbox is active

### 3. Create a User

After deployment, create a test user:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username abhishekbansal9719@gmail.com \
  --user-attributes Name=email,Value=abhishekbansal9719@gmail.com Name=email_verified,Value=true \
  --temporary-password TempPass123! \
  --message-action SUPPRESS \
  --region us-east-1

aws cognito-idp admin-set-user-password \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username abhishekbansal9719@gmail.com \
  --password Test@123 \
  --permanent \
  --region us-east-1
```

## After Backend is Deployed

1. **Update `amplify_outputs.json`** with the new IDs
2. **Commit and push** the updated file
3. **Test locally** with `npm run dev`
4. **Deploy to AWS Amplify** - your app will now connect to real backend resources

## Verify Backend Deployment

In AWS Console:
- **Cognito** → User Pools → You should see your pool
- **Amplify** → Your App → Backend tab → Should show deployed resources

## Current Issue

Your `amplify_outputs.json` has these IDs:
- User Pool: `us-east-1_AazUwGNOW`
- Client ID: `146cpglt3af5hpmqiujrar9729`

But we can't verify if these resources actually exist without AWS credentials. You need to:
1. Deploy the backend
2. Get the correct IDs
3. Update amplify_outputs.json
4. Then your login will work!

