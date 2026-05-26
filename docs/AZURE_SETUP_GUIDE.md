# Azure Setup Guide - GeoUMKM Intelligence v4.0

This guide walks you through setting up all Azure services required for the GeoUMKM Intelligence platform. Each step includes both Azure Portal (UI) instructions and Azure CLI commands.

## Prerequisites

Before you begin, ensure you have:

- **Azure Account** with a Pay-As-You-Go subscription
  - Sign up at [https://azure.microsoft.com/free/](https://azure.microsoft.com/free/) if you do not have one
- **Azure CLI** installed on your local machine
  - Check version: `az --version` (requires 2.50.0 or newer)
  - Install guide: [https://learn.microsoft.com/en-us/cli/azure/install-azure-cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
  - macOS: `brew install azure-cli`
  - Windows: Download MSI from the link above
  - Linux (Ubuntu/Debian): `curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`
- **Authenticate** with Azure CLI:
  ```bash
  az login
  ```
  This opens a browser window for authentication. After login, verify with:
  ```bash
  az account show
  ```

---

## Quick Start (Local Development - No Azure Required)

You can run the frontend locally without any Azure services configured:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/geoumkm-smart-3.git
cd geoumkm-smart-3/frontend

# Install dependencies
pnpm install

# Create environment file with placeholder values
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:7071/api
NEXT_PUBLIC_APP_NAME=GeoUMKM Intelligence
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=placeholder
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=placeholder
NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME=placeholder

# Start development server
pnpm dev
```

**What works without Azure:**
- Landing page (all sections, animations, responsive design)
- Dashboard layout and navigation
- Auth page UI (forms render, but login will not authenticate)
- All static/client-side components

**What requires Azure services:**
- User authentication (needs Entra ID B2C)
- AI Chat (needs Azure OpenAI + Azure Functions)
- Credit Scoring, Clustering, Location Intelligence (needs Azure Functions + SQL)
- Data export/reports (needs Blob Storage)

---

## Cost Estimation Summary

| Service | Tier | Monthly Cost (est.) |
|---------|------|---------------------|
| Static Web Apps | Free | $0 |
| Functions App | Consumption | ~$0 (free tier: 1M exec/month) |
| SQL Database | Basic (5 DTU) | ~$4.90 |
| OpenAI Service | Pay-per-use | ~$5-20 (depends on usage) |
| AI Search | Free | $0 |
| Blob Storage | LRS Hot | ~$0.50 |
| Entra ID B2C | 50k free auth/month | $0 |
| Key Vault | Standard | ~$0.03 |
| **Total** | | **~$10-25/month** |

> **Note:** Azure OpenAI costs vary based on token usage. The estimate assumes moderate development/testing usage (~100k tokens/month with gpt-4o).

---

## Step 1: Create Resource Group

A resource group is a container that holds all related Azure resources for your application.

### Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. In the top search bar, type **"Resource groups"** and click on it
3. Click **"+ Create"** button at the top left
4. Fill in the form:
   - **Subscription:** Pay-As-You-Go (or your subscription name)
   - **Resource group name:** `rg-geoumkm-prod`
   - **Region:** Southeast Asia (closest to Indonesia)
5. Click **"Review + create"**
6. Click **"Create"**

### Azure CLI

```bash
az group create \
  --name rg-geoumkm-prod \
  --location southeastasia
```

### Expected Outcome

- Resource group `rg-geoumkm-prod` appears in your resource group list
- Location shows "Southeast Asia"
- You can navigate to it and see an empty resource group ready for resources

---

## Step 2: Create Azure Static Web Apps

Azure Static Web Apps hosts the Next.js frontend with automatic CI/CD from GitHub.

### Azure Portal

1. In the search bar, type **"Static Web Apps"** and click on it
2. Click **"+ Create"**
3. Fill in the **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Name:** `swa-geoumkm-frontend`
   - **Plan type:** Free
   - **Region:** East Asia (or closest available)
   - **Source:** GitHub
4. Click **"Sign in with GitHub"** and authorize Azure
5. After connecting GitHub:
   - **Organization:** your GitHub username
   - **Repository:** `geoumkm-smart-3`
   - **Branch:** `main`
6. In **Build Details:**
   - **Build Presets:** Custom
   - **App location:** `/frontend`
   - **Api location:** (leave empty)
   - **Output location:** `.next`
7. Click **"Review + create"** then **"Create"**

### Azure CLI

```bash
az staticwebapp create \
  --name swa-geoumkm-frontend \
  --resource-group rg-geoumkm-prod \
  --source https://github.com/YOUR_USERNAME/geoumkm-smart-3 \
  --location eastasia2 \
  --branch main \
  --app-location "/frontend" \
  --output-location ".next" \
  --login-with-github
```

### Getting the Deployment Token

After creation, retrieve the deployment token (needed for GitHub Actions):

**Portal:** Go to Static Web App > Overview > Manage deployment token > Copy

**CLI:**
```bash
az staticwebapp secrets list \
  --name swa-geoumkm-frontend \
  --resource-group rg-geoumkm-prod \
  --query "properties.apiKey" -o tsv
```

### Expected Outcome

- Static Web App `swa-geoumkm-frontend` is created
- A URL is generated (e.g., `https://thankful-tree-0162cfc00.eastasia.azurestaticapps.net`)
- GitHub Actions workflow may be auto-created (we will replace it with our own)
- Deployment token is available for CI/CD

---

## Step 3: Create Azure Functions App

Azure Functions hosts the Python backend API (credit scoring, clustering, location intelligence endpoints).

### Azure Portal

1. Search **"Function App"** in the top bar and click on it
2. Click **"+ Create"**
3. Fill in the **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Function App name:** `func-geoumkm-api`
   - **Runtime stack:** Python
   - **Version:** 3.11
   - **Region:** Southeast Asia
   - **Operating System:** Linux
   - **Plan type:** Consumption (Serverless)
4. Click **"Next: Storage"**
   - A storage account will be auto-created (or select existing)
5. Click **"Next: Networking"** (leave defaults)
6. Click **"Review + create"** then **"Create"**

### Azure CLI

```bash
# Create a storage account for the function app
az storage account create \
  --name stgeoumkmfunc \
  --resource-group rg-geoumkm-prod \
  --location southeastasia \
  --sku Standard_LRS

# Create the function app
az functionapp create \
  --name func-geoumkm-api \
  --resource-group rg-geoumkm-prod \
  --storage-account stgeoumkmfunc \
  --consumption-plan-location southeastasia \
  --runtime python \
  --runtime-version 3.11 \
  --os-type Linux \
  --functions-version 4
```

### Expected Outcome

- Function App `func-geoumkm-api` appears in your resource group
- Default URL: `https://func-geoumkm-api.azurewebsites.net`
- Storage account `stgeoumkmfunc` is created for function state
- Runtime is Python 3.11 on Linux Consumption plan

---

## Step 4: Create Azure SQL Database

Azure SQL stores UMKM records, user data, credit scores, and clustering results.

### Azure Portal

1. Search **"SQL databases"** and click on it
2. Click **"+ Create"**
3. **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Database name:** `db-geoumkm`
4. Under **Server**, click **"Create new"**:
   - **Server name:** `sql-geoumkm-server`
   - **Location:** Southeast Asia
   - **Authentication method:** Use SQL authentication
   - **Server admin login:** `geoumkm_admin`
   - **Password:** (choose a strong password, save it securely)
   - Click **"OK"**
5. **Compute + storage:** Click **"Configure database"**
   - Select **Basic** tier
   - DTU: 5
   - Storage: 2 GB
   - Estimated cost: ~$4.90/month
   - Click **"Apply"**
6. Click **"Next: Networking"**
   - **Connectivity method:** Public endpoint
   - **Allow Azure services:** Yes
   - **Add current client IP:** Yes
7. Click **"Review + create"** then **"Create"**

### Azure CLI

```bash
# Create SQL server
az sql server create \
  --name sql-geoumkm-server \
  --resource-group rg-geoumkm-prod \
  --location southeastasia \
  --admin-user geoumkm_admin \
  --admin-password "YOUR_STRONG_PASSWORD_HERE"

# Create database with Basic tier
az sql db create \
  --name db-geoumkm \
  --resource-group rg-geoumkm-prod \
  --server sql-geoumkm-server \
  --edition Basic \
  --capacity 5

# Allow Azure services to access the server
az sql server firewall-rule create \
  --name AllowAzureServices \
  --resource-group rg-geoumkm-prod \
  --server sql-geoumkm-server \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your current IP (replace with your IP)
az sql server firewall-rule create \
  --name AllowMyIP \
  --resource-group rg-geoumkm-prod \
  --server sql-geoumkm-server \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### Connection String Format

```
Server=tcp:sql-geoumkm-server.database.windows.net,1433;Initial Catalog=db-geoumkm;Persist Security Info=False;User ID=geoumkm_admin;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### Expected Outcome

- SQL Server `sql-geoumkm-server.database.windows.net` is available
- Database `db-geoumkm` is created with Basic tier (5 DTU)
- Firewall rules allow Azure services and your development IP
- Connection string can be tested with Azure Data Studio or sqlcmd
- Estimated monthly cost: ~$4.90

---

## Step 5: Create Azure OpenAI Service

Azure OpenAI powers the AI chat assistant with the gpt-4o model.

### Important: Request Access First

Azure OpenAI requires approval before you can create a resource.

1. Go to [https://aka.ms/oai/access](https://aka.ms/oai/access)
2. Fill in the application form:
   - Use case: Business intelligence for SME/UMKM sector
   - Expected usage: Chat completions, text analysis
3. Wait for approval (typically 1-5 business days)
4. You will receive an email when approved

### Azure Portal (After Access is Granted)

1. Search **"Azure OpenAI"** and click on it
2. Click **"+ Create"**
3. **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Region:** East US (or available region - not all regions have all models)
   - **Name:** `oai-geoumkm`
   - **Pricing tier:** Standard S0
4. Click **"Review + submit"** then **"Create"**
5. After creation, go to the resource
6. Click **"Model deployments"** > **"Manage Deployments"** (opens Azure AI Studio)
7. Click **"+ Create new deployment"**:
   - **Model:** gpt-4o
   - **Deployment name:** `gpt-4o`
   - **Deployment type:** Standard
   - **Tokens per Minute Rate Limit:** 30K (adjust based on needs)
8. Click **"Create"**

### Azure CLI

```bash
# Create OpenAI resource
az cognitiveservices account create \
  --name oai-geoumkm \
  --resource-group rg-geoumkm-prod \
  --location eastus \
  --kind OpenAI \
  --sku S0

# Deploy gpt-4o model
az cognitiveservices account deployment create \
  --name oai-geoumkm \
  --resource-group rg-geoumkm-prod \
  --deployment-name gpt-4o \
  --model-name gpt-4o \
  --model-version "2024-05-13" \
  --model-format OpenAI \
  --sku-capacity 30 \
  --sku-name Standard
```

### Getting the API Key and Endpoint

```bash
# Get endpoint
az cognitiveservices account show \
  --name oai-geoumkm \
  --resource-group rg-geoumkm-prod \
  --query "properties.endpoint" -o tsv

# Get API key
az cognitiveservices account keys list \
  --name oai-geoumkm \
  --resource-group rg-geoumkm-prod \
  --query "key1" -o tsv
```

### Expected Outcome

- OpenAI resource `oai-geoumkm` is created
- Endpoint: `https://oai-geoumkm.openai.azure.com/`
- gpt-4o model is deployed and ready for API calls
- API key is available for authentication
- Cost: Pay-per-use (~$5/1M input tokens, ~$15/1M output tokens for gpt-4o)

---

## Step 6: Create Azure AI Search

Azure AI Search provides RAG (Retrieval Augmented Generation) capabilities over the UMKM knowledge base.

### Azure Portal

1. Search **"AI Search"** (formerly Azure Cognitive Search) and click on it
2. Click **"+ Create"**
3. **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Service name:** `search-geoumkm`
   - **Location:** Southeast Asia
   - **Pricing tier:** Free (for development) or Basic (for production)
     - Free tier: 50 MB storage, 3 indexes, 10K documents
     - Basic tier: 2 GB storage, 15 indexes, ~$70/month
4. Click **"Review + create"** then **"Create"**

### Azure CLI

```bash
az search service create \
  --name search-geoumkm \
  --resource-group rg-geoumkm-prod \
  --location southeastasia \
  --sku free
```

### Getting the Admin Key

```bash
az search admin-key show \
  --service-name search-geoumkm \
  --resource-group rg-geoumkm-prod \
  --query "primaryKey" -o tsv
```

### Expected Outcome

- AI Search service `search-geoumkm` is created
- Endpoint: `https://search-geoumkm.search.windows.net`
- Admin and query keys are available
- Ready to create indexes for UMKM knowledge base documents
- Free tier cost: $0/month

---

## Step 7: Create Azure Blob Storage

Azure Blob Storage stores ML models, exported reports, and static assets.

### Azure Portal

1. Search **"Storage accounts"** and click on it
2. Click **"+ Create"**
3. **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Storage account name:** `stgeoumkmdata`
   - **Region:** Southeast Asia
   - **Performance:** Standard
   - **Redundancy:** Locally-redundant storage (LRS)
4. Click **"Next: Advanced"**
   - **Access tier:** Hot
   - Leave other defaults
5. Click **"Review + create"** then **"Create"**

### Create Containers

After the storage account is created:

**Portal:**
1. Go to the storage account
2. Click **"Containers"** in the left menu
3. Click **"+ Container"** three times to create:
   - `models` (Private access) - for ML model files
   - `assets` (Blob access) - for public static assets
   - `exports` (Private access) - for exported reports

**CLI:**
```bash
# Create storage account
az storage account create \
  --name stgeoumkmdata \
  --resource-group rg-geoumkm-prod \
  --location southeastasia \
  --sku Standard_LRS \
  --access-tier Hot

# Get connection string
CONN_STRING=$(az storage account show-connection-string \
  --name stgeoumkmdata \
  --resource-group rg-geoumkm-prod \
  --query connectionString -o tsv)

# Create containers
az storage container create --name models --connection-string "$CONN_STRING"
az storage container create --name assets --connection-string "$CONN_STRING" --public-access blob
az storage container create --name exports --connection-string "$CONN_STRING"
```

### Expected Outcome

- Storage account `stgeoumkmdata` is created
- Three containers exist: `models`, `assets`, `exports`
- Connection string is available for application configuration
- Estimated cost: ~$0.50/month (minimal storage usage)

---

## Step 8: Create Azure Entra ID B2C

Azure Entra ID B2C (formerly Azure AD B2C) handles user authentication and registration.

### Important: B2C Creates a Separate Tenant

Unlike other resources, B2C creates a separate Azure AD tenant. This is normal - you will switch between your main tenant and the B2C tenant.

### Azure Portal

#### 8.1 Create B2C Tenant

1. Search **"Azure AD B2C"** and click on it
2. Click **"Create a new Azure AD B2C Tenant"**
3. Fill in:
   - **Organization name:** GeoUMKM Auth
   - **Initial domain name:** `geoumkmauth` (becomes geoumkmauth.onmicrosoft.com)
   - **Country/Region:** Indonesia
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
4. Click **"Review + create"** then **"Create"**
5. Wait for creation (can take 2-3 minutes)

#### 8.2 Register Application

1. Switch to the new B2C tenant (click your profile > Switch directory)
2. Go to **Azure AD B2C** > **App registrations** > **"+ New registration"**
3. Fill in:
   - **Name:** `GeoUMKM Frontend`
   - **Supported account types:** Accounts in any identity provider or organizational directory
   - **Redirect URI:** Web - `https://YOUR_STATIC_WEB_APP_URL/.auth/login/aadb2c/callback`
   - Also add: `http://localhost:3000/.auth/login/aadb2c/callback` (for local dev)
4. Click **"Register"**
5. Note the **Application (client) ID** - you will need this

#### 8.3 Create User Flows

1. Go to **Azure AD B2C** > **User flows**
2. Click **"+ New user flow"**
3. Select **"Sign up and sign in"** > **"Recommended"**
4. Fill in:
   - **Name:** `B2C_1_signup_signin`
   - **Identity providers:** Email signup
   - **User attributes:** Email Address, Display Name
5. Click **"Create"**

### Expected Outcome

- B2C tenant `geoumkmauth.onmicrosoft.com` is created
- Application `GeoUMKM Frontend` is registered with a Client ID
- User flow `B2C_1_signup_signin` handles sign-up and sign-in
- Free tier: 50,000 authentications per month at no cost

---

## Step 9: Setup Azure Key Vault

Azure Key Vault securely stores all connection strings, API keys, and secrets.

### Azure Portal

1. Search **"Key vaults"** and click on it
2. Click **"+ Create"**
3. **Basics** tab:
   - **Subscription:** Pay-As-You-Go
   - **Resource group:** `rg-geoumkm-prod`
   - **Key vault name:** `kv-geoumkm`
   - **Region:** Southeast Asia
   - **Pricing tier:** Standard
4. Click **"Next: Access configuration"**
   - **Permission model:** Azure role-based access control (recommended)
5. Click **"Review + create"** then **"Create"**

### Azure CLI

```bash
# Create Key Vault
az keyvault create \
  --name kv-geoumkm \
  --resource-group rg-geoumkm-prod \
  --location southeastasia \
  --sku standard

# Store secrets (replace with your actual values)
az keyvault secret set --vault-name kv-geoumkm --name "sql-connection-string" \
  --value "Server=tcp:sql-geoumkm-server.database.windows.net,1433;..."

az keyvault secret set --vault-name kv-geoumkm --name "openai-api-key" \
  --value "YOUR_OPENAI_API_KEY"

az keyvault secret set --vault-name kv-geoumkm --name "openai-endpoint" \
  --value "https://oai-geoumkm.openai.azure.com/"

az keyvault secret set --vault-name kv-geoumkm --name "search-admin-key" \
  --value "YOUR_SEARCH_ADMIN_KEY"

az keyvault secret set --vault-name kv-geoumkm --name "storage-connection-string" \
  --value "YOUR_STORAGE_CONNECTION_STRING"

az keyvault secret set --vault-name kv-geoumkm --name "b2c-client-id" \
  --value "YOUR_B2C_CLIENT_ID"
```

### Grant Function App Access to Key Vault

```bash
# Enable managed identity on Function App
az functionapp identity assign \
  --name func-geoumkm-api \
  --resource-group rg-geoumkm-prod

# Get the principal ID (from output above)
PRINCIPAL_ID=$(az functionapp identity show \
  --name func-geoumkm-api \
  --resource-group rg-geoumkm-prod \
  --query principalId -o tsv)

# Grant Key Vault Secrets User role
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee "$PRINCIPAL_ID" \
  --scope "/subscriptions/YOUR_SUB_ID/resourceGroups/rg-geoumkm-prod/providers/Microsoft.KeyVault/vaults/kv-geoumkm"
```

### Expected Outcome

- Key Vault `kv-geoumkm` is created
- All secrets are stored securely
- Function App has managed identity with access to read secrets
- Estimated cost: ~$0.03/month (based on operations)

---

## Step 10: Configure Environment Variables

### Static Web Apps Environment Variables

Set these in the Azure Portal under Static Web Apps > Configuration > Application settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://func-geoumkm-api.azurewebsites.net/api` | Functions API base URL |
| `NEXT_PUBLIC_APP_NAME` | `GeoUMKM Intelligence` | Application display name |
| `NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME` | `geoumkmauth` | B2C tenant name |
| `NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID` | `(your client ID)` | B2C application client ID |
| `NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME` | `B2C_1_signup_signin` | B2C user flow name |

### Functions App Environment Variables

Set these in Azure Portal under Function App > Configuration > Application settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `SQL_CONNECTION_STRING` | `@Microsoft.KeyVault(SecretUri=...)` | Key Vault reference |
| `AZURE_OPENAI_ENDPOINT` | `@Microsoft.KeyVault(SecretUri=...)` | Key Vault reference |
| `AZURE_OPENAI_API_KEY` | `@Microsoft.KeyVault(SecretUri=...)` | Key Vault reference |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt-4o` | Model deployment name |
| `AZURE_SEARCH_ENDPOINT` | `https://search-geoumkm.search.windows.net` | AI Search endpoint |
| `AZURE_SEARCH_KEY` | `@Microsoft.KeyVault(SecretUri=...)` | Key Vault reference |
| `AZURE_STORAGE_CONNECTION_STRING` | `@Microsoft.KeyVault(SecretUri=...)` | Key Vault reference |

### CLI: Set Static Web App Environment Variables

```bash
az staticwebapp appsettings set \
  --name swa-geoumkm-frontend \
  --resource-group rg-geoumkm-prod \
  --setting-names \
    NEXT_PUBLIC_API_URL="https://func-geoumkm-api.azurewebsites.net/api" \
    NEXT_PUBLIC_APP_NAME="GeoUMKM Intelligence" \
    NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME="geoumkmauth" \
    NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID="YOUR_CLIENT_ID" \
    NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME="B2C_1_signup_signin"
```

### Local Development Template (frontend/.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:7071/api
NEXT_PUBLIC_APP_NAME=GeoUMKM Intelligence

# Azure AD B2C (use placeholders for local dev)
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=geoumkmauth
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=placeholder-client-id
NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME=B2C_1_signup_signin
```

---

## Step 11: Deploy via GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys the frontend to Azure Static Web Apps.

### How It Works

The workflow file is located at `.github/workflows/deploy-frontend.yml`. It:
1. Triggers on push to `main` branch (when frontend/ files change)
2. Installs Node.js 22 and pnpm
3. Runs `pnpm install` and `pnpm build` in the frontend/ directory
4. Deploys the built output to Azure Static Web Apps

### Setup GitHub Secret

1. **Get the deployment token** from Azure:
   - Portal: Go to Static Web Apps > Your app > **Manage deployment token** > Copy
   - CLI:
     ```bash
     az staticwebapp secrets list \
       --name swa-geoumkm-frontend \
       --resource-group rg-geoumkm-prod \
       --query "properties.apiKey" -o tsv
     ```

2. **Add to GitHub repository secrets:**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Secrets and variables** > **Actions**
   - Click **"New repository secret"**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: (paste the deployment token)
   - Click **"Add secret"**

### Test Deployment

1. Push a change to the `main` branch:
   ```bash
   git push origin main
   ```
2. Go to **Actions** tab in GitHub to monitor the workflow
3. After completion, visit your Static Web App URL to verify

### Troubleshooting

- **Build fails:** Check that `pnpm build` works locally in the frontend/ directory
- **Deploy fails:** Verify the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret is set correctly
- **404 on routes:** Ensure `staticwebapp.config.json` has navigation fallback configured

---

## Step 12: Enable Azure OpenAI for AI Chat (Optional)

This step enables the AI Chat assistant feature using Azure OpenAI with RAG (Retrieval Augmented Generation).

### Prerequisites

- Azure OpenAI access must be approved first
- Apply at: [https://aka.ms/oai/access](https://aka.ms/oai/access)
- Approval typically takes 1-5 business days
- Use case: "Business intelligence chatbot for SME analytics"

### 12.1 Create Azure OpenAI Resource

If you have not already created the Azure OpenAI resource in Step 5, follow the instructions there to create it. Otherwise, verify the resource exists and the gpt-4o model is deployed:

**Portal:**
1. Go to [portal.azure.com](https://portal.azure.com)
2. Search **"Azure OpenAI"** and click on your `oai-geoumkm` resource
3. Go to **Model deployments** > **Manage Deployments**
4. Verify `gpt-4o` deployment exists and is active

**CLI:**
```bash
# Verify the resource exists
az cognitiveservices account show \
  --name oai-geoumkm \
  --resource-group rg-geoumkm-prod

# Verify gpt-4o deployment
az cognitiveservices account deployment list \
  --name oai-geoumkm \
  --resource-group rg-geoumkm-prod
```

### 12.2 Configure Azure AI Search for RAG

1. Create a search index named `umkm-knowledge-base`
2. Upload knowledge base documents (from `/ml/data/` CSV files converted to searchable documents)
3. Configure semantic search and vector search
4. Set up indexer to auto-refresh data

```bash
# Create index
az search index create \
  --name umkm-knowledge-base \
  --service-name search-geoumkm \
  --resource-group rg-geoumkm-prod \
  --fields '[
    {"name": "id", "type": "Edm.String", "key": true, "searchable": false},
    {"name": "content", "type": "Edm.String", "searchable": true, "analyzer": "id.microsoft"},
    {"name": "title", "type": "Edm.String", "searchable": true},
    {"name": "category", "type": "Edm.String", "filterable": true, "facetable": true},
    {"name": "source", "type": "Edm.String", "filterable": true},
    {"name": "embedding", "type": "Collection(Edm.Single)", "searchable": true, "dimensions": 1536, "vectorSearchProfile": "default-profile"}
  ]'

# Upload documents (using Python script)
python scripts/upload_knowledge_base.py
```

### 12.3 Environment Variables for AI Chat

Set these environment variables in the Azure Functions App:

| Variable | Value | Where |
|----------|-------|-------|
| `AZURE_OPENAI_ENDPOINT` | `https://oai-geoumkm.openai.azure.com/` | Function App |
| `AZURE_OPENAI_API_KEY` | (from Key Vault) | Function App |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt-4o` | Function App |
| `AZURE_SEARCH_ENDPOINT` | `https://search-geoumkm.search.windows.net` | Function App |
| `AZURE_SEARCH_KEY` | (from Key Vault) | Function App |
| `AZURE_SEARCH_INDEX` | `umkm-knowledge-base` | Function App |

### 12.4 Cost Estimation

| Component | Monthly Cost |
|-----------|-------------|
| Azure OpenAI (gpt-4o) | $20-80 (based on usage) |
| Azure AI Search (Basic) | $70 (if upgraded from Free) |
| **Total** | **$30-100/month** |

### 12.5 Manual Steps Summary

| Step | Action | Cannot be automated |
|------|--------|---------------------|
| 1 | Apply for Azure OpenAI access | Requires manual form submission and approval |
| 2 | Prepare knowledge base documents | Requires domain expert review |
| 3 | Test chat quality | Requires human evaluation of responses |
| 4 | Configure content filters | Requires manual policy decisions |

---

## Step 13: Create Demo Video for Landing Page (Manual)

This is a fully manual step to create a demo video/GIF for the landing page hero section.

### Prerequisites

- Application must be deployed and accessible
- Screen recording software: OBS Studio (free, cross-platform) or Loom (cloud-based)

### 13.1 Record the Demo

Recommended flow to record (30-60 seconds):

1. Start at landing page - show hero and scroll briefly
2. Navigate to Dashboard Overview - show map and KPIs
3. Show Credit Scoring page briefly
4. Open AI Chat and ask a question
5. Show a Policy Simulation result

### 13.2 Recording Settings

- Resolution: 1920x1080 (will be scaled down)
- Frame rate: 30fps for MP4, 15fps for GIF
- Format: MP4 (H.264 codec)

### 13.3 Convert to Web-Optimized Format

```bash
# Convert MP4 to web-optimized MP4 (smaller file)
ffmpeg -i demo-raw.mp4 -vcodec h264 -acodec aac -strict -2 -crf 28 -preset slow -vf scale=1280:720 demo.mp4

# Convert to GIF (for fallback/preview)
ffmpeg -i demo.mp4 -vf "fps=12,scale=640:-1:flags=lanczos" -c:v gif demo-preview.gif

# Alternative: Create WebM for better compression
ffmpeg -i demo-raw.mp4 -c:v libvpx-vp9 -b:v 1M -c:a libopus -vf scale=1280:720 demo.webm
```

### 13.4 Upload and Integration

1. Place files in `/frontend/public/demo/`:
   - `demo.mp4` (target: <10MB)
   - `demo-preview.gif` (target: <5MB)
2. Update landing page hero to reference the video
3. Verify loading performance

### 13.5 Tips

- Keep it under 60 seconds for engagement
- Use a clean browser (no extensions visible)
- Record during off-peak hours (if using live API)
- Consider adding captions/annotations in post-production

---

## Step 14: Custom Domain Setup (Optional)

Configure a custom domain for your GeoUMKM application.

### 14.1 Purchase a Domain

Recommended Indonesian domain providers:

- Niagahoster (niagahoster.co.id) - `.id` domains from Rp 120k/year
- Rumahweb (rumahweb.com)
- Domainesia (domainesia.com)

Suggested domains: `geoumkm.id`, `geoumkm.co.id`, `geoumkm.app`

### 14.2 Configure in Azure Portal

1. Go to **Static Web Apps** > `swa-geoumkm-frontend`
2. Click **Custom domains** in the left menu
3. Click **+ Add**
4. Enter your domain (e.g., `geoumkm.id` or `www.geoumkm.id`)
5. Azure will show the validation record needed

### 14.3 DNS Configuration

At your domain registrar, add these records:

**For root domain (geoumkm.id):**

| Type | Name | Value |
|------|------|-------|
| ALIAS/ANAME | @ | thankful-tree-0162cfc00.eastasia.azurestaticapps.net |

**For www subdomain:**

| Type | Name | Value |
|------|------|-------|
| CNAME | www | thankful-tree-0162cfc00.eastasia.azurestaticapps.net |

> **Note:** Replace the Static Web App URL with your actual deployment URL.

### 14.4 SSL Certificate

- Azure Static Web Apps automatically provisions a free SSL certificate
- Certificate is issued within minutes of DNS validation
- Auto-renews before expiration

### 14.5 Azure CLI

```bash
az staticwebapp hostname set \
  --name swa-geoumkm-frontend \
  --resource-group rg-geoumkm-prod \
  --hostname geoumkm.id
```

### 14.6 Verification

1. Wait for DNS propagation (5 min to 48 hours)
2. Check with: `nslookup geoumkm.id`
3. Visit https://geoumkm.id in browser
4. Verify SSL lock icon appears
5. Test www redirect works

### Troubleshooting

- **DNS not resolving:** Wait up to 48 hours, check TTL settings
- **SSL error:** Ensure DNS is pointing correctly, wait for certificate provisioning
- **404 on custom domain:** Check `staticwebapp.config.json` navigationFallback

---

## Summary

After completing all steps, your GeoUMKM Intelligence v4.0 platform will have:

- **Frontend** hosted on Azure Static Web Apps (auto-deployed from GitHub)
- **Backend API** on Azure Functions (Python, serverless)
- **Database** on Azure SQL (Basic tier, relational data)
- **AI Services** via Azure OpenAI (gpt-4o) + AI Search (RAG)
- **File Storage** on Azure Blob Storage (models, reports)
- **Authentication** via Azure Entra ID B2C (user sign-up/sign-in)
- **Secrets Management** via Azure Key Vault
- **AI Chat with RAG** (Optional, Step 12) - intelligent chat using knowledge base
- **Demo Video** (Optional, Step 13) - landing page hero video/GIF
- **Custom Domain** (Optional, Step 14) - professional domain with SSL

Total estimated monthly cost for development: **~$10-25/month**

With optional services (Azure OpenAI + AI Search Basic): **~$40-125/month**

For production with higher tiers, expect **~$100-200/month** depending on usage.
