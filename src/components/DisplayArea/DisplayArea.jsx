function DisplayArea({ textElements, searchQuery }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        minHeight: '200px',
        padding: '10px',
        marginBottom: '20px',
      }}
    >
      {textElements.map((item) => (
        <span
          key={item.id}
          style={{
            color: item.color,
            fontSize: item.fontSize,
            fontFamily: item.fontFamily,
            backgroundColor:
              searchQuery && item.char === searchQuery ? 'yellow' : 'transparent',
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  )
}

export default DisplayArea
