import { useState } from 'react'

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Content = ({ course }) => {
  return (
    course.parts.map((part) => <Part key={part.id} part={part} />)
  )
}

const ExerciseSum = ({ course }) => {
  let sum = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <p>
      <strong>
        total of {sum} exercises
      </strong>
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <ExerciseSum course={course} />
    </>
  )
}

const CourseListHeader = ({ name }) => {
  return (
    <h1>{name}</h1>
  )
}

const CourseList = ({ courseList }) => {
  return (
    <>
      <CourseListHeader name={"Web development curriculum"} />
      {courseList.map((course) => <Course course={course} key={course.id} />)}
    </>
  )
}
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <CourseList courseList={courses} />
}

export default App
