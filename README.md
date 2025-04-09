<!-- header -->
<div align="center">
  <img src="https://github.com/user-attachments/assets/876cf6c4-1ba0-458e-bfc1-3489b3bc1de1" width="320" alt="Project Logo" />
  
  &nbsp;

  A client-side web application that automates data transformation, converting user-entered text into structured <a href="https://docs.liquibase.com/concepts/changelogs/home.html">Changelog</a> XML, eliminating the need for manual XML generation.
</div>

</br>

## 1. Installation
To run this project locally, follow these steps:

1. Clone the repository.
```bash
git clone https://github.com/jd0x0021/lcgenjd.git
```

&nbsp;

2. Install dependencies.
```bash
cd lcgenjd
```
```bash
npm install
```

&nbsp;

3. Start the application.
```bash
npm run dev
```

The app will be running at http://localhost:5173.

</br>

## 2. Usage
1. **Enter data:** use the **Left Panel**, to input your <a href="https://docs.liquibase.com/concepts/changelogs/home.html">changelog</a> details, such as author, logical file path, changesets etc.

![image](https://github.com/user-attachments/assets/46b614a4-8dbd-42b4-9e85-f2bec15ce8c9)

&nbsp;

2. **Real-time update:** The changelog XML (<a href="https://docs.liquibase.com/concepts/changelogs/home.html">see XML example</a>) is generated instantly as you make changes in the **changelog data (user-input) panel** (left panel), which will automatically update the preview on the **xml visualizer panel** (right panel).

![image](https://github.com/user-attachments/assets/72199135-3a3a-446a-b760-8a2c5f998339)

</br>

### 2.1. Adding Changesets to the Changelog

> A changeset is the basic unit of change in Liquibase. You store all your <a href="https://docs.liquibase.com/concepts/changelogs/changeset.html">changesets</a> in your <a href="https://docs.liquibase.com/concepts/changelogs/home.html">changelog</a>. Your changesets contain <a href="https://docs.liquibase.com/change-types/home.html">Change Types</a> (SQL statements applied to your database) that specify what each change does, such as creating a new table, adding a column to an existing table, inserting new data, or updating an existing database record.

&nbsp;

Clicking the **Add Changeset** button on the upper left corner adds a changeset to the changelog. Each changeset will automatically have a unique ID, which is derived from the logical file path.

![image](https://github.com/user-attachments/assets/575b606d-5f8e-4215-ae7d-7018a756f57a)

</br>

### 2.2. User-Input to XML Mapping (for <a href="https://docs.liquibase.com/change-types/insert.html">Insert Change Type</a>)

1. Author.
![image](https://github.com/user-attachments/assets/9d97d70e-0fd7-46f9-8099-159bd509d4c8)

&nbsp;

2. Logical File Path.
![image](https://github.com/user-attachments/assets/784394dd-7507-489c-9cdd-36efa965e4bc)

&nbsp;

3. Changeset's comment.
![image](https://github.com/user-attachments/assets/8b990a7b-0dd5-43bc-ba78-d47da7adf365)

&nbsp;

4. Database table's name (this is the table where we'll insert our new data). _Clicking the **Add Table** button in the changeset component will add a new database table._
![image](https://github.com/user-attachments/assets/92f7867e-1705-4587-bc45-b6e4d55b29c0)

&nbsp;

5. Common columns (like audit fields) are automatically generated.
![image](https://github.com/user-attachments/assets/61c15241-bcfb-4605-8890-215a9655baa6)

&nbsp;

6. Database columns.
![image](https://github.com/user-attachments/assets/0d378646-4b91-4cdb-893c-513e36ad5da7)

&nbsp;

7. One row in this insert DML table is equivalent to a whole new row inserted to the specified database table.
![image](https://github.com/user-attachments/assets/f95ac92a-6e02-4164-ba23-c925e30f185e)

&nbsp;

8. Automatic rollbacks (all rows that are added by this changeset will be rolled back by this condition).
![image](https://github.com/user-attachments/assets/95558d51-f3e0-4256-bd2a-39fc61b7f140)

</br>

## 3. Core UI Libraries
1. <a href="https://www.npmjs.com/package/react-split">react-split</a>: provides a responsive, and dynamic split-view layout.
2. <a href="https://www.npmjs.com/package/react-syntax-highlighter">react-syntax-highlighter</a>: adds syntax highlighting to the structured XML output for improved readability.

</br>

## 4. Hosting
This client-side web application is hosted on <a href="https://pages.cloudflare.com/">Cloudflare Pages</a> for fast and reliable deployment.
