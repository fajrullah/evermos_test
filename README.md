# EVERMOS case test

## Installation
```
$ npm install
```

```
$ cp .env.example .env
```

Change the .env's value

place .env in root project, same level with .env.example
```
# .env
# APPLICATION
PORT=5445
NODE_ENV=production
VERSION=v1.0.0

# DATABASE
ISDATABASENAME=db_example
ISUSERNAME=root
ISPASSWORD=
ISHOSTDATABASE=localhost
ISDIALECT=mysql
```
## Important !

```
make sure you have DB that you listed on .env
the DB must exist unless can not running
support MySQL, MariaDB, SQLite, PostgreSQ and Microsoft SQL Server databases
```

## Usage

running for treasure hunt
```
npm run game
```

running for PoC
```
npm run start
```
### PoC Section assuming PORT 5445

#### Seeding and destroy
Seeding Data
```
curl --location --request GET 'localhost:5445/seeding'
```
Destroy
```
curl --location --request GET 'localhost:5445/products'
```

#### Accessing resources
Get Active Cart
```
curl --location --request GET 'localhost:5445/carts'
```
Get All Orders
```
curl --location --request GET 'localhost:5445/orders'
```
Get All Products
```
curl --location --request GET 'localhost:5445/products'
```

#### Cart and Checkout

Store Product to cart
```
curl --location --request POST 'localhost:5445/carts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "productID": 2,
    "quantity": 2
}'
```

Checkout the Cart
```
curl --location --request POST 'localhost:5445/orders' \
--header 'Content-Type: application/json' \
--data-raw '{
    "cartID": 1
}'
```

## Section Explanation
Assuming Case:

Those cases might be caused by either coding Issue or DB issue commonly, but are not limited

### A. In Coding sides : 
  - the issue has appeared because the function for decreasing QTY of product was wrong.
  - it might be no function for checking the QTY before decreasing.
  - the function for decreasing or input the orders is "Async" function without "await" before decreasing, so the 
  next step will be triggered without "await" from previous until finished means the next-function was running without previous functions has finished their jobs.
  - the decreasing function got "Error" so can not decrease the QTY but system still process customer orders.
  - there are MATH problem, ie : '10' - 1 = NaN
  - Backend shows wrong QTY to FE.
  - there is no HOLD function for product if out of stock or similiar.
  - if the System adopted "QUEUE" role so it might be released QTY wrongly.

  - Cart did wrong QTY, assuming that QTY is out of Stock for particular Product but in cart the QTY is available.

    ie: cart still accepted even though the requested quantity is greater than stock
    assuming the stock 10 the requested 12 or greater

    ie: in Active Cart for "Product A" qty = 2 but "Product A" is actually out of stock, so there is no sync between cart and stock.

    ie: can added into Cart even though the "Product A" was out of stock.

  - Check out function did wrong validation, in active cart there are products with status "out of stock" but the checkout allowed to process the cart to be an order.

  Not Limited to: 

  - in other applications / services that use same table does wrong calculation so the QTY is not sync

### B. In DB Sides : 

  There are more than one QTY pointing at

  - ie : there are table "stock" for product with particular QTY and inside table "product" itself has QTY so there are two table for describing QTY.


## Solutions Offered:

  - HOLD the QTY when status order is "PENDING PAYMENT" or before it then release QTY if no payment has received.
  - always check the QTY before insert to CART.
  - in Cart always gets first about current status of product to make sure the data is sync.
  - when Checkout also check it first about status of product either available or not.
  - make sure the function for decreasing uses "sync" method.
  - make sure the QTY is pointing correctly with correct table and data type.
  - make sure it's number to number calculation, it will be problem if the prolang is Strong Data Type.
  - the safest but not limited if the FLASH SALE has particular QTY of product, so the stock is not mixed by other applications/service that pointing to it
