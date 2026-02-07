# MongoDB Installation and Setup Guide

## 🚨 Issue Found: MongoDB Not Installed

MongoDB is not installed on your system, which is why the applicants page shows 0 applicants even when candidates have applied.

## 🔧 Solution: Install MongoDB

### Option 1: MongoDB Community Server (Recommended)
1. **Download MongoDB**: https://www.mongodb.com/try/download/community
2. **Select Windows** and download the MSI installer
3. **Run the installer** with default settings
4. **Install MongoDB Compass** (GUI tool) - optional but recommended

### Option 2: MongoDB Atlas (Cloud Database)
1. **Sign up**: https://www.mongodb.com/cloud/atlas
2. **Create free cluster**
3. **Get connection string**
4. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
   ```

### Option 3: Docker (Advanced)
```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

## ✅ After Installation

### 1. Start MongoDB Service
```bash
# Windows
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### 2. Restart Backend
```bash
npm run dev
```

### 3. Test Connection
- Backend should show: "MongoDB connected successfully"
- Applicants page should show real data

## 🔍 Verification

### Check MongoDB is Running:
```bash
mongod --version
```

### Check Database Connection:
- Backend console should show connection success
- No "connection refused" errors

## 📊 Expected Results

After MongoDB is running:
- ✅ Real applicants will show up
- ✅ Job applications will be saved
- ✅ Accept/Reject functionality will work
- ✅ Resume uploads will work

## 🆘 If Still Issues

1. **Check MongoDB Service**: `services.msc` → Find MongoDB
2. **Check Port 27017**: `netstat -an | findstr 27017`
3. **Check Firewall**: Allow MongoDB port
4. **Check .env file**: Correct MONGODB_URI

## 🎯 Quick Fix

The fastest solution is MongoDB Community Server installation. Once installed and running, all applicant features will work immediately.
