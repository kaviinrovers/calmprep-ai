# 🗄️ MongoDB Atlas Setup - Step by Step

## Current Step: Creating Cluster ✅

I can see you're on the cluster creation page. Here's what to do:

---

## Step 1: Create Cluster (You're here!)

**Settings I can see:**
- ✅ Name: `Cluster0` (good!)
- ✅ Provider: AWS (recommended)
- ✅ Region: Mumbai (ap-south-1) - perfect for India
- ✅ Automate security setup: Checked
- ✅ Preload sample dataset: Checked (optional, but fine)

**Click "Create Deployment"** button at the bottom right!

⏳ **Wait 3-5 minutes** for cluster to deploy...

---

## Step 2: Create Database User (Next)

After cluster is created, you'll be prompted to create a user:

1. **Username**: `calmprep` (or any name you like)
2. **Password**: Click "Autogenerate Secure Password" OR create your own
3. **⚠️ SAVE THE PASSWORD!** You'll need it for the connection string
4. Click "Create Database User"

---

## Step 3: Configure Network Access

1. You'll be asked to add IP addresses
2. Click "**Add My Current IP Address**" 
3. **ALSO** click "**Add a Different IP Address**"
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all (for Render)`
4. Click "Finish and Close"

---

## Step 4: Get Connection String

1. Click "**Connect**" button on your cluster
2. Choose "**Drivers**" (or "Connect your application")
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Replace**:
   - `<username>` with your database username (e.g., `calmprep`)
   - `<password>` with your database password
   - Add `/calmprep` before `?retryWrites`

**Final connection string example:**
```
mongodb+srv://calmprep:YourPassword123@cluster0.xxxxx.mongodb.net/calmprep?retryWrites=true&w=majority
```

---

## Step 5: Add to Render

1. Go to https://dashboard.render.com → `calmprep-ai` service
2. Click "**Environment**" tab
3. Add variable:
   - Name: `MONGODB_URI`
   - Value: (your connection string from above)
4. Click "Save Changes"
5. Wait 5 minutes for Render to redeploy

---

## ✅ Ready to Use!

After Render redeploys with MongoDB connection string:
- Visit https://calmprep-ai.vercel.app
- Try signup again - **it will work!** 🎉

---

**Currently waiting for:** Cluster creation to complete (3-5 min)
**Next step:** Create database user & get connection string
