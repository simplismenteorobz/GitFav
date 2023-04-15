export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({login, name, public_repos, followers }) => 
    ({
      login,
      name,
      public_repos,
      followers
    }))
  }
}

//dados
class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load() 
  }
  
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  
  load() {
    this.entries = this.entries = JSON.parse(localStorage.getItem
      ('@github-favorites:')) || []
  }

  async add(username){
    try {

      const userExist = this.entries.find(entry => entry.login === username)

      if(userExist) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    
    }catch(error){
      alert(error.message)
    }
  }

  delete(user) {
    //Higher order function
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login
    )
    
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}


//visualização html
export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector("table tbody")
  
    this.update()
    this.onadd()
  }

  update() {
    this.nofav()
    
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.user img').alt = `Imagem de ${user.nome}.`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector(".remove").addEventListener('click', () => {
        const isOk = confirm("Tem certeza que deseja deletar este usuário?")
        
        if(isOk) {
          this.delete(user)
        }
      })

      this.tbody.append(row)
    })
  }

  onadd() {
    const addButton = this.root.querySelector(".input-wrapper button")
    
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".input-wrapper input")

      this.add(value)

      document.querySelector('.input-wrapper input').value = ''
    }

    window.document.onkeyup = event => {
      if(event.key === "Enter"){ 
        const { value } = this.root.querySelector('.input-wrapper input')

        this.add(value)

        document.querySelector('.input-wrapper input').value = ''
      }
  }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/simplismenteorobz.png" alt="Foto de Perfil">
      <a href="https://github.com/simplismenteorobz" target="_blank">
        <p>Roberto</p>
        <span>/simplismenteorobz</span>
      </a>
    </td>
    <td class="repositories">
      1
    </td>
    <td class="followers">
      12
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
  `

  return tr
  } 

  removeAllTr() {
    const tbody = this.root.querySelector('table tbody')
    
    tbody.querySelectorAll('tr')
    .forEach(tr => tr.remove())
  }

  nofav() {
    if (this.entries.length === 0) {
      this.root.querySelector('.empty').classList.remove('hide')
    } else {
      this.root.querySelector('.empty').classList.add('hide')
    }
  }
}