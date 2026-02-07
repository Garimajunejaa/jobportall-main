# MongoDB Atlas Setup Guide

## 🔍 Current Issue: MongoDB Atlas Connection Failed

Error: `querySrv ECONNREFUSED _mongodb._tcp.cluster.mongodb.net`

This means the connection string is not correct or network issues.

## 🔧 Fix MongoDB Atlas Connection

### Step 1: Get Your Actual Connection String

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login to your account**
3. **Select your cluster**
4. **Click "Connect"**
5. **Select "Connect your application"**
6. **Copy the connection string**

### Step 2: Update Your .env File

Replace the placeholder connection string in `.env`:

```env
# BEFORE (placeholder):
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/jobportal

# AFTER (your actual connection string):
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobportal?retryWrites=true&w=majority
```

### Step 3: Common Connection String Formats

#### Format 1: Standard Atlas
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobportal?retryWrites=true&w=majority
```

#### Format 2: With IP Whitelist
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobportal?retryWrites=true&w=majority&authSource=admin
```

#### Format 3: Direct Connection (if SRV fails)
```
mongodb://username:password@cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017/jobportal?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

### Step 4: Network Requirements

#### IP Whitelist:
1. **Go to Atlas → Network Access**
2. **Add your IP address**: `0.0.0.0/0` (for testing) or your specific IP
3. **Save changes**

#### Firewall:
- Make sure port 27017 is open
- Check if your network blocks MongoDB Atlas

### Step 5: Test Connection

After updating `.env`, restart backend:

```bash
npm run dev
```

Expected output:
```
Server running at port 8000
MongoDB connected successfully
```

## 🆘 Troubleshooting

### If Still Fails:

1. **Check Network**:
   ```bash
   nslookup cluster.mongodb.net
   ```

2. **Test with MongoDB Compass**:
   - Use the same connection string
   - See if Compass can connect

3. **Check Atlas Cluster Status**:
   - Make sure cluster is running
   - Check for any maintenance

4. **Verify Credentials**:
   - Username and password are correct
   - User has proper permissions

## 🎯 Quick Fix

The fastest solution is to:
1. Get your actual Atlas connection string
2. Update the `.env` file
3. Add your IP to whitelist
4. Restart backend

## 📞 Need Help?

If you need help finding your connection string:
1. Login to MongoDB Atlas
2. Go to your cluster
3. Click "Connect"
4. Follow the steps for "Connect your application"
5. Copy the connection string provided

Once you have the correct connection string, update the `.env` file and restart the backend.
