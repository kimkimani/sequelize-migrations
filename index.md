Sequelize provides you wit a CLI that will let you Create/Generate migration file using **npx migration:create --name create table_name** command. You then use **npx sequelize-cli db:migrate** command to run database Migrations for your Node.js based application. This wy Sequelize CLI will auto create you database tables and puulate it using Node.js Sequelize code. You only need a few command to get to this goal.

In this guide, you will leanr how to use sequelize cli. Sequelize CLI will then allow you ro run commands to create/generate and run Sequelize Migrations to a PostgreSQL database using Node.js. In summary, you will learn:

- How to use Sequelize CLI to create Node.js and a Sequelize project.
- Using Sequelize to generate Migrations and Model files.
- Gereating sequelize migration from Models.
- How to run a generated Sequelize Migrations and populate yor tables with commands such as **npx sequelize-cli db:migrate**.
- How to undo or reverta Sequelize created Migrations.
- The best way to add Sequelize migrations while using Sequelize associates. This lets use sequelize migration with fields such foreign keys.
- How to Undo and revert exsiting migrations.
- You will use this Sequelize Migrations setup to create a Node.js API with Express.

Ready? Dive into this guide and Create|Generate|Run Sequelize CLI db Migrations With Node.js.

### What you Need to Get Sequelize CLI Migrations Ready

Before attepting to use Sequelize CLI to generate and run yor Migrations, ensure:

- Node.js is ready in your computer.
- Have prior Knowledge working with Sequelize and Node.js.
- Atleast have one Running relational database. I will use PostgreSQL along this guide. However, MySQL and other related databases works perfect with this setup.

### What is Sequelize Migrations

Sequelize Migrations is feature for Sequelize ORM. Creating Database Migrations will make it easier to manage changes to the database schema over time in a structured and reproducible way.

Sequelize Migrations defines incremental changes to the database schema through JavaScript files. This way, you will track and apply these changes across tour application.

If your creating databases using Sequelize Migrations you get:

- database  schema versioning to track table strcture changes. You can Revert to previous states if necessary.
- You will achive atomicity as if an error occurs during migration, Sequelize automatically rolls back the previous working transaction to maintain database integrity.
- Migrations are only defined using JavaScript files with `up` and `down` functions. 

### Why Use Sequelize CLI to Create DB Migrations

To generate and run Sequelize Migrations, you need a Sequelize CLI. It has all commands you need for managing Sequelize projects when generating and running migrations. You'll get:

- Sequelize CLI built-in Commands to manage Migrations.
- Sequelize CLI automatically loads database configuration settings
- Sequelize CLI creates a unified environment for managing database schema changes.

Lets now dive in and use Sequelize CLI to Overall, create, generate, and run Sequelize migrations with Sequelize ORM in a Node.js project.

### Creating a Sequelize Node.js app

Be sure you're in your working directory and get Node.js ready:

```bash
npm init -y
```

Ypu will need the following dependencies:

- Sequelize ORM to abstracte over SQL databases.
- pg or mysql2 - PostgreSQL client library for Node.js or MySQL if yo are using MySQL server.
- Sequelize CLI to provide command-line tools Sequelize Migrations 
- Express if yor want to extend this setup and create a Node.js express API with Sequelize migrations.

Run the following command to install them:

```bash
npm install sequelize express mysql2 pg
```

You will need to install Sequelize CLI as a dev dependency:

```bash
npm install --save-dev sequelize-cli
```

Your app is ready.

### Initializing Sequelize Migrations with Sequelize CLI

You dont have to create your Node.js Sequelize app from scratch. One you have the above packages ready, you will use the Sequelize CLI. Run the following command:

```bash
npx sequelize-cli init
```

You will get the following directories:

- `config` with a `config.json` file to create database connections.
- `models` to store your Sequelize model files.
- `migrations` for storing your migration files.
- `seeders` if you plan to use seeders, this directory will store your seed files.
### Adding Sequelize Database Migrations Configurations

You will use `config/config.json` file in your project to configure your database connection settings.

This should be simple and staighfowtad. Add the dtails og the databse you are using and the connections details as you need the.

Because I'm running the application locally and using PostgreSQL, I will create a shop database the add the details to `config/config.json` file under development as follows:

```js
    "username": "postgres",
    "password": "pass",
    "database": "marwadtech",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "migrationStorageTableName":"migrations"
```

Note that you must chode dialect as the databse server you are using. If on MySQL update these details as such

Also, the `"migrationStorageTableName":"migrations"` part is optional. During migrations, Sequelize will create a table to save migrations history. In this case we want the table to created with the name `migrations`. Chose your ideal name.

### Creating your First Sequelize Migration

Lets say you want to add Sequelize migrations to a Product table. The following command will be perfect:

```bash
npx sequelize-cli migration:generate --name create-products
```

However, you stillwa tn to create a model while ruuning a Sequelize CLI migration command. Thereofr. will chose to create Migrations and Models using one single command.

In this case, you want to have a Model generated at the sema time the Migration files ready. However, you will need to provide atleast one attibute with its related date time, I used the Product name as follows (We will add other attribures along the way):

```bash
npx sequelize-cli model:generate --name Products --attributes name:string
```

![](migration.jpg)

Now you have:

- New model was created at `\models\products.js`. You can now go ahead and update the attribures to the application model as follows:

```ts
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {

    static associate(models) {
      // define association here
    }
  }
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    inventory: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Products',
    tableName: "products",
    underscored: true,
    timestamps: true,
  });
  return Products;
};
```

Here, I added the following as attributes to Product mode:

```bash
    price: DataTypes.DECIMAL,
    inventory: DataTypes.INTEGER,
    created_at: DataTypes.DATE
```

At the same time, Sequelize will allows you modify your model with other arrtibes such as timestamps tabel names, etc as follows:

```ts
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    inventory: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'products', // Database table name
    underscored: true, // Use underscored naming convention for columns
    timestamps: true, // Automatically manage createdAt and updatedAt columns
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
```

- New migration was created at `\migrations\20240212071957-create-products.js`. Now it need to mact what attributes tou have in yor model. Update `migrations\20240212071957-create-products.js` file. Here, you will add price and inventory columns to the table definition, matching the model's attributes as follows:

```js
'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // for some reasons make sure the Table name is products with small letter and not Products with caps
    // I test Products with CRUD API and the server failed to get the Products schema
    // The solution worked when I used products
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      inventory: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
```

> For some reasons make sure the Table name is `products` with small letter and not `Products` with caps. I test `Products` with CRUD API and the server failed to get the Products schema. The solution worked when I used `products`.

### Running your First Sequelize Migration with Sequelize CLI

The mont have come and you be ready to run and apply your first Migration using npx sequelize-cli db:migrate command.

At this moment, ensure yu have your database server up and running. You also make sure you have the shop database ready.

Go ahead and run the following command:

```bash
npx sequelize-cli db:migrate
```

And if you line to use `package.json` file add a new scipt as such:

```bash
"migrate": "npx sequelize-cli db:migrate",
```

Then use command `npm run migrate`:

Sequelize CLI will use npx sequelize-cli db:migrate and apply your migeation to your databse as follows:

![](run.jpg)

Now, confirm your databse. Based on yor migrations you shoild have everthing ready as follows:

![](tables.jpg)

The Shop database will be populated with the table products and the migrations table will record the created migrations. Use **npx sequelize-cli db:migrate:status** command to track current state of your database schema:

![](up.jpg)

### How to use Sequelize CLI and Undo Migrations with NPX

Sequelize suppoerts atomicity. Every successful migration will be recoreded in the migrations table.

This means you can always rever back to an exiting migration. You only need to use npx sequelize-cli db:migrate:undo as Sequelize CLI will revert them as follows:

```bash
# undo(delete) table last created
npx sequelize-cli db:migrate:undo

# undo(delete) table all created
npx sequelize db:migrate:undo:all
#undo(delete) table selected
npx sequelize-cli db:migrate:undo --name 20240212071957-create-products.js
```

![](revert.jpg)

If you use **npx sequelize-cli db:migrate:status** command, Sequelize will tell you that the Migrations is in Down status:

![](down.jpg)

### Creating Migrations with Sequelize Associates

Sequelize associates define relationships between different models. You want to repesent vething around associates within you migrations.

Each Model created with Sequelize CLI has an `associate` function within each model to establish associations with other models.

Now lets say you want to add `ProductSale` table in this case:

- Product has one-to-many relationship with ProductSale
- ProductSale has many-to-one relationship with Product model

You only need to go ahead and create your models and migrations using Sequelize CLI as follows:

First create the ProductSale migrations and its model as follows:

```bash
npx sequelize-cli model:generate --name ProductSale --attributes soldQuantity:integer
```

Now head over to `models/productsale.js` file and make sure you  model have the right associate as follows:

```js

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  // Extending the Model class to define ProductSale model
  class ProductSale extends Model {
    // Static method to define associations
    static associate(models) {
 
      // Define many-to-one relationship with Products model
      ProductSale.belongsTo(models.Products, { foreignKey: 'productId' });
    }
  }
  
  // Initialize ProductSale model with attributes and options
  ProductSale.init({
    productId: DataTypes.INTEGER,
    soldQuantity: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL
  }, {
    sequelize, // Database connection instance
    modelName: 'ProductSale', // Model name
  });

  // Return the defined model
  return ProductSale;
};
```

Here, Sequelize `belongsTo` method will tell the CLI, HEY, create an association between this (the source: ProductSale) and the provided target Product. The foreign key should be added as the the source.

Now go to `migrations/20240212100311-create-product-sale.js` file and update your Migrations scipt for ProductSale. This should have attribute with a foreign key relationship to Products. Use the "**references**" field as follows:

```js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'ProductSale' table
    await queryInterface.createTable('productsale', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
        // Name of the related table
          model: 'Products', //Or product based on your Product schema 
          key: 'id', // Primary key of the related table
        },
      },
      soldQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      sellingPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Undo the creation of the 'ProductSale' table
    await queryInterface.dropTable('productsale');
  },
};
```

At the same time, you need to create an N:M association with a join table. The model `Products` that will be associated with ProductSale hasOne relationship. Update `model/products.js` file with Sequelize associate as follows:

```js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {

    static associate(models) {
      // define association here
      // Define one-to-many relationship with ProductSale
      Products.hasMany(models.ProductSale, { foreignKey: 'productId' });
    }
  }
  
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    inventory: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Products',
    tableName: "products",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Products;
};
```

Now, you need to run your **npx sequelize-cli db:migrate** command as follows:

```bash
npx sequelize-cli db:migrate 
```

![](hasmany.jpg)

Check your databse to confirm this changes:

![](associates.jpg)

### Appling Sequelize Migrations with Node.js Server

Once you have the Migrations ready, the next step is to use the same setup and create a CRUD Node.js API with Sequelize.

Lets in this section create a very simple API using the generated Sequelize CLI Configurations.

To make it simple, I will only use the Products Model and Migrations. Consider removing the association with ProductSale before proceding.

Because you have the model ready and databse connection in your config.json file ready, lets go direct to create the controllers and routes.

In the same project directory, add `products.repo.js` file. Here you now need to import you model and create your moethod. I only use create and fetch with Sequelize as follows:

```js
const { Products } = require("./models");

exports.GetProducts = () => {
  return Products.findAll();
};

exports.AddProduct = (productsData) => {
  return Products.create({
    ...productsData,
    created_at: Date(),
  });
};
```

Create a `products.router.js` file to excecute the above methods as follows:

```js
const express = require("express");
const router = express.Router();
const ProductsRepo = require("./products.repo");


router.get("/products", async (req, res) => {
  try {
    var productsList = await ProductsRepo.GetProducts();
    return res.send(productsList);
  } catch (err) {
    console.log(err);
  }
});

router.post("/products", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body) {
      const { name, price, inventory } = req.body;
      console.log(req.body);
      const ProductsData = await ProductsRepo.AddProduct({
        name,
        price,
        inventory,
      });
      res.send({ message: "data added !!", ProductsData });
    } else {
      console.log("no body found");
      res.send({ message: "body not found or available" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
```

Now, create an `index.js` to run the server. Note that here you dont need to create a new database conenction. Just use what you already have in your file. Here is the complete code:

```js
const express = require("express");
const config = require('./config/config.json');
const ProductsRouter = require("./products.router");
const Sequelize = require("sequelize");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting  routers

app.use("/api", ProductsRouter);

// Get the environment from the NODE_ENV environment variable, defaulting to 'development'
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

Ensure you have Express installed:

```bash
npm install express
```

Finally run the `node index.js` command to start the server:

```bash
node index.js
```

![](server.jpg)

Use `http://localhost:3000/api/products` to access the server and selelect products.

![](get.jpg)

Or use Postman to send POST requests to `http://localhost:3000/api/products` and add items as follows:

![](post.jpg)

### Conclusion

In this comprehensive Node.js tutorial, you have learned how to create, generate and run Sequelize Migrations with Sequelize CLI. You have learned:

- How to use Sequelize CLI to create Node.js and a Sequelize project.
- Using Sequelize to generate Migrations and Model files.
- How to run a generated Sequelize Migrations and populate yor tables with commands such as **npx sequelize-cli db:migrate**.
- How to undo or reverta Sequelize created Migrations.
- The best way to add Sequelize migrations while using Sequelize associates.
- How to Undo and revert exsiting migrations.
- Using Sequelize Migrations setup to create a Node.js API with Express.

Happy coding 🚀💥