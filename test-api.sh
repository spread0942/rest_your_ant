#!/bin/bash

# Restaurant Management API Test Script
echo "🧪 Testing Restaurant Management API"
echo "===================================="

BASE_URL="http://localhost:3000/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-200}
    local description=$5
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "🔗 $method $BASE_URL$endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
            -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            $BASE_URL$endpoint)
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
            -X $method \
            $BASE_URL$endpoint)
    fi
    
    # Extract status and body
    status=$(echo $response | grep -o 'HTTPSTATUS:[0-9]*' | cut -d: -f2)
    body=$(echo $response | sed 's/HTTPSTATUS:[0-9]*$//')
    
    # Check status
    if [ "$status" -eq "$expected_status" ]; then
        echo -e "✅ ${GREEN}Status: $status${NC}"
    else
        echo -e "❌ ${RED}Status: $status (expected $expected_status)${NC}"
    fi
    
    # Pretty print JSON if possible
    if echo "$body" | jq . >/dev/null 2>&1; then
        echo "📄 Response:"
        echo "$body" | jq .
    else
        echo "📄 Response: $body"
    fi
}

echo "⏳ Waiting for server to be ready..."
sleep 2

# Test health endpoint
test_endpoint "GET" "/health" "" 200 "Health Check"

# Test creating an account
test_endpoint "POST" "/accounts/register" '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
}' 201 "Create Account"

# Test login
test_endpoint "POST" "/accounts/login" '{
    "email": "test@example.com",
    "password": "password123"
}' 200 "Login Account"

# Test getting all restaurants
test_endpoint "GET" "/restaurants" "" 200 "Get All Restaurants"

# Test getting all menus
test_endpoint "GET" "/menus" "" 200 "Get All Menus"

# Test getting all plates
test_endpoint "GET" "/plates" "" 200 "Get All Plates"

# Test getting all drinks
test_endpoint "GET" "/drinks" "" 200 "Get All Drinks"

# Test getting all products
test_endpoint "GET" "/products" "" 200 "Get All Products"

# Test getting all tables
test_endpoint "GET" "/tables" "" 200 "Get All Tables"

echo -e "\n🎉 ${GREEN}API testing completed!${NC}"
echo "📝 Make sure the server is running with: npm run dev"
