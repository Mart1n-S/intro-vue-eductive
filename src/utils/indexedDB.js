import { openDB } from 'idb'

// Nom de la base de données IndexedDB
const DB_NAME = 'todoDB'
// Nom de l'objet store (table) dans IndexedDB
const STORE_NAME = 'todos'

// Fonction asynchrone pour initialiser la base de données
async function initDB() {
  // Ouverture de la base de données 'todoDB' avec la version 1
  const db = await openDB(DB_NAME, 1, {
    // Fonction de mise à niveau pour créer l'objet store s'il n'existe pas
    upgrade(db) {
      // Vérification si l'objet store 'todos' n'existe pas
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Création de l'objet store 'todos' avec un keyPath 'id' qui sera auto-incrémenté
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
  // Retourne l'instance de la base de données
  return db
}

// Fonction asynchrone pour sauvegarder les todos dans IndexedDB
export async function saveTodos(todos) {
  // Initialisation de la base de données
  const db = await initDB()
  // Ouverture d'une transaction en mode 'readwrite' sur l'objet store 'todos'
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  // Effacement de tous les enregistrements existants dans l'objet store
  await transaction.objectStore(STORE_NAME).clear()

  // Parcours de la liste des todos pour les ajouter à l'objet store
  for (const todo of todos) {
    // Création d'une copie simplifiée de l'objet todo pour garantir qu'il est clonable
    const simpleTodo = JSON.parse(JSON.stringify(todo))
    // Ajout de l'objet simpleTodo à l'objet store
    await transaction.objectStore(STORE_NAME).put(simpleTodo)
  }
  // Attente de la fin de la transaction
  await transaction.done
  console.log('Todos saved to IndexedDB within saveTodos')
}

// Fonction asynchrone pour charger les todos depuis IndexedDB
export async function loadTodos() {
  // Initialisation de la base de données
  const db = await initDB()
  // Récupération de tous les enregistrements de l'objet store 'todos'
  const todos = await db.transaction(STORE_NAME).objectStore(STORE_NAME).getAll()
  console.log('Todos loaded from IndexedDB within loadTodos', todos)
  // Retourne la liste des todos
  return todos
}
