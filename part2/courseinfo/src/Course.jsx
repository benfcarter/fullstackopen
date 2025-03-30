
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

  export default Course