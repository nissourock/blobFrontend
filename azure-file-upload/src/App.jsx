import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Mettez à jour ces variables avec votre SAS URL et le nom du conteneur Azure
  const sasUrl = "https://tpazurestorage.blob.core.windows.net?sp=racwdl&st=2025-03-19T14:09:29Z&se=2025-04-11T21:09:29Z&sv=2022-11-02&sr=c&sig=rzctNTrsOp9nP8EL2y6A%2B3dIizrPt0CqouBDYjbss8k%3D";
  const containerName = "tpazure";

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      // Validation du type de fichier (seulement JPG autorisé)
      if (selectedFile.type !== 'image/jpeg') {
        setMessage('Veuillez sélectionner un fichier JPG.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      // Création du BlobServiceClient avec le SAS URL
      const blobServiceClient = new BlobServiceClient(sasUrl);
      
      // Récupération du container client
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      // Récupération du block blob client avec le nom du fichier
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      // Téléversement du fichier depuis le navigateur
      await blockBlobClient.uploadBrowserData(file);

      setMessage("Téléversement réussi !");
      
      // Réinitialisation du champ de sélection après un téléversement réussi
      setFile(null);
      document.getElementById('file-input').value = '';
    } catch (error) {
      console.error("Échec du téléversement :", error);
      setMessage("Échec du téléversement. Vérifiez la console pour plus d'erreurs.");
    }
    setUploading(false);
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Ingestion de Scans Médicaux</h1>
      </header>
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Téléversez un scan médical (JPG)</h2>
          <input 
            id="file-input"
            type="file" 
            onChange={handleFileChange} 
            accept="image/jpeg" 
            style={styles.input}
          />
          {file && <p style={styles.fileName}>Fichier sélectionné : {file.name}</p>}
          <button 
            onClick={handleUpload} 
            disabled={!file || uploading} 
            style={styles.button}
          >
            {uploading ? 'Téléversement...' : 'Téléverser'}
          </button>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5'
  },
  header: {
    backgroundColor: '#1890ff',
    padding: '20px',
    color: '#fff',
    textAlign: 'center'
  },
  title: {
    margin: 0,
    fontSize: '2rem'
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%'
  },
  heading: {
    marginBottom: '20px',
    fontSize: '1.5rem'
  },
  input: {
    marginBottom: '20px',
    padding: '10px'
  },
  fileName: {
    marginBottom: '20px',
    fontStyle: 'italic'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  message: {
    marginTop: '20px',
    fontSize: '1rem'
  }
};

export default App;
