
# Getting Started

## The Arbitre workflow

Arbitre organizes courses as such :

```
course 1
┣ session 1
┃ ┣ exercise 1
┃ ┗ exercise 2
┗ session 2
```

Courses contain several sessions, sessions contain several exercises.

## Create a course

> Example course : *Learning Python*

Students are registered to courses. They can see and interact with the sessions and exercises that belong to the courses they are registered to.

On the home page, you are presented with a list of courses and a **New Course** button.

:::info Can't see the New Course button ?

Your account has not been registered as a teacher account.
Contact your system administrator.

:::

Click **New Course**.

Enter a **title** and a **description**. Don't worry, you can edit everything later.

:::tip

Markdown is supported for all descriptions across Arbitre. See [Markdown Reference](https://www.markdownguide.org/basic-syntax/).

:::

## Create a session

> Example session : *Getting started with Python*

Click **Create Session**.

Enter a **title** and a **description**.

## Create your first exercise

> Example exercise : *Summing numbers*

### Provide a description

The description is the statement of your exercise.

### Write tests

A test is an assertion to check for in order to determine if a student succeeded or failed an exercise.

#### Example tests

| **Exercise**       | **Input** | **Output** |
|--------------------|-----------|------------|
| **Double number**  | `4`         | `16`         |
| **Inverse string** | `Hello`     | `olleH`      |
| **Sort array**     | `[2,3,1]`   | `[1,2,3]`    |

### Try it out

In the **Submit** tab, you can submit a file to see the tests running.