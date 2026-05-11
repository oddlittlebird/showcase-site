# Cockroach DB Tutorial

This page walks you through how to start a local node, create a database with a table, and perform simple CRUD (create, read, update, delete) functions on the data.

## Prerequisites

Install the latest version of CockroachDB (requires Windows PowerShell).  
**Note:** If PowerShell does not accept `cockroach` commands copied and pasted from this page, try typing `.\` in front of the command.

## 1. Start a single-node cluster.

In PowerShell, change directory (`cd`) to the Cockroach DB folder:  
```cd C:\cockroach-v19.2.0-alpha.20190701.windows-6.2-amd64```

Start a local node in insecure mode:  
```cockroach start --insecure --listen-addr=localhost```

[//]: # (Begin content reuse chunk from Start a Local Cluster)
This command starts a node in insecure mode, accepting most cockroach start defaults.

* The --insecure flag makes communication unencrypted.
* The --listen-addr=localhost flag tells the node to listen only on localhost, with default ports used for internal and client traffic (26257) and for HTTP requests from the Admin UI (8080).
* Node data is stored in the cockroach-data directory.
* The standard output gives you helpful details such as the CockroachDB version, the URL for the Admin UI, and the SQL URL for clients.  

[//]: # (End content reuse chunk)

## 2. Create a database.

Open a new PowerShell terminal and `cd` to the Cockroach DB folder:  
```cd C:\cockroach-v19.2.0-alpha.20190701.windows-6.2-amd64``` 

Open the built-in Cockroach SQL client:  
```cockroach sql --insecure --host=localhost:26257```

Create a database called my_db:  
```CREATE DATABASE my_db;```

[//]: # (Not sure if setting the database as deault is necessary if you only have one, but figured this step wouldn't hurt. Also, the user might already have a database.)
Set the database as default:  
```SET DATABASE = my_db;```

## 3. Create a table.

Create a table to store family information:  
```CREATE TABLE family (id INT, name STRING, birthday DATE, pets BOOLEAN);```

This creates an empty table. Next, we will insert data into it.

## 4. Insert data.

To insert a row into the family table, use `INSERT INTO` followed by the table name and then the column values listed in the order in which the columns appear in the table:  
```INSERT INTO family (id, name, birthday, pets) values (1, 'Germaine', '2019-03-08 12:16:26', true);```

You can insert multiple rows with one statement:  
```INSERT INTO family (id, name, birthday, pets) values (2, 'Nichole', '2019-03-07 17:41:51', false), (3, 'Glad', '2019-03-01 10:28:22', false), (4, 'Milton', '2019-03-05 23:21:22', true), (5, 'Derron', '2019-06-19 22:31:30', true), (6, 'Anissa', '2018-10-11 00:33:53', false);```

This creates a table of family data. Next, we will look at the data in the table.

## 5. Read data.

To read (query) data in the table, use `SELECT` followed by a comma-separated list of the columns to be returned and the table from which to retrieve the data:  
```SELECT name, birthday FROM family;```

```
    name   |         birthday
+----------+---------------------------+
  Germaine | 2019-03-08 00:00:00+00:00
  Nichole  | 2019-03-07 00:00:00+00:00
  Glad     | 2019-03-01 00:00:00+00:00
  Milty    | 2019-03-05 00:00:00+00:00
  Derron   | 2019-06-19 00:00:00+00:00
  Anissa   | 2018-10-11 00:00:00+00:00
(6 rows)
```

To retrieve all columns, use the `*` wildcard:  
```SELECT * FROM family;```

```
  id |   name   |         birthday          | pets
+----+----------+---------------------------+-------+
   1 | Germaine | 2019-03-08 00:00:00+00:00 | true
   2 | Nichole  | 2019-03-07 00:00:00+00:00 | false
   3 | Glad     | 2019-03-01 00:00:00+00:00 | false
   4 | Milty    | 2019-03-05 00:00:00+00:00 | true
   5 | Derron   | 2019-06-19 00:00:00+00:00 | true
   6 | Anissa   | 2018-10-11 00:00:00+00:00 | false
(6 rows)
```

To filter the results, add a `WHERE` clause identifying the columns and values to filter on:    
```SELECT name, pets FROM family WHERE pets = true;```

```
    name   | pets
+----------+------+
  Germaine | true
  Milty    | true
  Derron   | true
(3 rows)
```

To sort the results, add an `ORDER BY` clause identifying the columns to sort by. For each column, you can choose whether to sort ascending (`ASC`) or descending (`DESC`):  
```SELECT name, pets FROM family ORDER BY name DESC;```

```
    name   | pets
+----------+-------+
  Nichole  | false
  Milty    | true
  Glad     | false
  Germaine | true
  Derron   | true
  Anissa   | false
(6 rows)
```

## 6. Update data.

To add a column to the table, use `ALTER TABLE` and `ADD COLUMN`, followed by the new column name and data type:  
```ALTER TABLE family ADD COLUMN age INT;```

To update rows in the table, use `UPDATE` followed by the table name, a `SET` clause identifying the columns to update and their new values, and a `WHERE` clause identifying the rows to update. For example, to add data to the age column:  
```UPDATE family SET age = 25 WHERE name ='Germaine';```  
```SELECT * FROM family;```

```
  id |   name   |         birthday          | pets  | age
+----+----------+---------------------------+-------+------+
   1 | Germaine | 2019-03-08 00:00:00+00:00 | true  |   25
   2 | Nichole  | 2019-03-07 00:00:00+00:00 | false | NULL
   3 | Glad     | 2019-03-01 00:00:00+00:00 | false | NULL
   4 | Milty    | 2019-03-05 00:00:00+00:00 | true  | NULL
   5 | Derron   | 2019-06-19 00:00:00+00:00 | true  | NULL
   6 | Anissa   | 2018-10-11 00:00:00+00:00 | false | NULL
(6 rows)
```

## 7. Delete data.

To delete rows from the table, use `DELETE FROM` followed by the table name and a `WHERE` clause identifying the rows to delete:  
```DELETE FROM family WHERE id IN (4,5,6);```  
```SELECT * FROM family;```

```
  id |   name   |         birthday          | pets  | age
+----+----------+---------------------------+-------+------+
   1 | Germaine | 2019-03-08 00:00:00+00:00 | true  |   25
   2 | Nichole  | 2019-03-07 00:00:00+00:00 | false | NULL
   3 | Glad     | 2019-03-01 00:00:00+00:00 | false | NULL
(3 rows)
```

To delete all data from a table without deleting the table, use `TRUNCATE` followed by the table name:  
```TRUNCATE family;```  
```SELECT * from family;```

```
  id | name | birthday | pets | age
+----+------+----------+------+-----+
(0 rows)
```

The table still exists, so you can add new data to it.

To completely remove the table from the database, use `DROP` followed by the table name:  
```DROP TABLE family;```  

## What's next?

* Explore all [SQL Statements](https://www.cockroachlabs.com/docs/stable/sql-statements.html).
* [Install the client driver](https://www.cockroachlabs.com/docs/stable/install-client-drivers.html) for your preferred language and [build an app](https://www.cockroachlabs.com/docs/stable/build-an-app-with-cockroachdb.html).
* [Explore core CockroachDB features](https://www.cockroachlabs.com/docs/stable/demo-data-replication.html) like automatic replication, rebalancing, and fault tolerance.