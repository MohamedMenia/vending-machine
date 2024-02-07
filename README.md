# vending-machine

Backend APIs for simulating a vending machine using NodeJS, ExpressJS, and Typescript.<br />
1. clone the project <br />
2. install NodeJS on your machine<br />
3. run `npm i` <br />
4. run  `npm start`<br />


> **NOTE**  <br/>
> I pushed the env file and created a user for you to use my MongoDB cluster, making it easier to run the project and easier to use inserted data all users password is "123123". <br />


## APIs: 
- user:
    - POST:   http://localhost:3030/user/          for creating a user and its login automatically<br />
    - GET:   http://localhost:3030/user/           for fetching all users in the database (admin role only)<br />
    - POST:   http://localhost:3030/user/login    for login<br />
    - PUT:   http://localhost:3030/user/id         for updating the user with id user can update only his data, admin can update all users<br />
    - DELETE: http://localhost:3030/user/id        When deleting the seller account products that he offers will  be deleted as well<br />
- Product:
    - POST:    http://localhost:3030/products/     For creating new products only admin and seller can use it<br />
    - GET      http://localhost:3030/products/      for  fetching all products all users can do it <br />
    - PUT:     http://localhost:3030/products/:id  for updating the product only the seller of the product and admin can use it  <br />
    - DELETE:  http://localhost:3030/products/:id  for deleting product only seller of the product and admin can use it <br />
- VendingMachine:
    - POST: http://localhost:3030/vendingMachine/  For buying products [{productId,amountOfProducts},{}...]
    - POST: http://localhost:3030/vendingMachine/buyerDeposit For deposit coins [5,10,20,50,100] only and forn buyer and admins only
    - POST: http://localhost:3030/vendingMachine/depositBack  For reset Deposit back



