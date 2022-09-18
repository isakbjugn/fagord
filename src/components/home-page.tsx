const Home = () => {
  return(
    <div>
      <div className="p-5 rounded-lg m-5 jumbotron">
        <h1 className="display-4">Velkommen til Fagord!</h1>
        <p className="lead">Fagord er din kilde til norske fagtermer! Innen fagfelt som IT,
            nanoteknologi og molekylærbiologi løper utviklingen langt raskere enn
            norske oversettelser kommer.</p>
        <p>Her finner du nye termer, og kan foreslå egne!</p>
        <a className="btn btn-primary btn-lg" href="/termliste" role="button">Til termliste!</a>
      </div>
    </div>
    
  )
}

export default Home;