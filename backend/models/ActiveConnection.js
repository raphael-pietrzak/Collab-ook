import db from '../config/database.js';

export default {
  // Récupérer toutes les connexions actives
  findAll: () => db('active_connections').select('*'),
  
  // Récupérer une connexion active par ID
  findById: (id) => db('active_connections').where('id', id).first(),
  
  // Récupérer les connexions actives pour un document
  findByDocumentId: (documentId) => 
    db('active_connections')
      .join('users', 'active_connections.user_id', 'users.id')
      .where('document_id', documentId)
      .select('users.username', 'users.id', 'active_connections.*'),
  
  // Créer une nouvelle connexion active
  create: (data) => 
    db('active_connections').insert(data).returning('*'),
  
  // Mettre à jour une connexion active
  update: (socketId, data) => 
    db('active_connections')
      .where('socket_id', socketId)
      .update(data),
  
  // Supprimer une connexion active par socket_id
  deleteBySocketId: (socketId) => 
    db('active_connections')
      .where('socket_id', socketId)
      .del(),
  
  // Récupérer une connexion active par socket_id
  findBySocketId: (socketId) => 
    db('active_connections')
      .join('users', 'active_connections.user_id', 'users.id')
      .where('socket_id', socketId)
      .first()
};
