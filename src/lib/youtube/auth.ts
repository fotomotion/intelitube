import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
].join(' ');

export async function connectYouTubeChannel() {
  const auth = getAuth();
  
  // Verificar se já existe um usuário autenticado
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Usuário não autenticado');
  }

  const provider = new GoogleAuthProvider();
  
  // Adicionar escopos necessários
  SCOPES.split(' ').forEach(scope => {
    provider.addScope(scope);
  });

  // Configurar opções do popup
  provider.setCustomParameters({
    prompt: 'consent',
    access_type: 'offline',
    include_granted_scopes: 'true',
    login_hint: currentUser.email // Usar o mesmo email para manter consistência
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('Não foi possível obter o token de acesso');
    }

    // Salvar as credenciais no Firestore
    const docRef = doc(db, 'youtube_connections', currentUser.uid);
    await setDoc(docRef, {
      accessToken: credential.accessToken,
      refreshToken: result.user.refreshToken,
      channelId: '', // Será preenchido após primeira chamada à API
      connected: true,
      connectedAt: new Date(),
      userId: currentUser.uid,
      scopes: SCOPES.split(' ')
    }, { merge: true });

    return credential;
  } catch (error) {
    console.error('Error connecting YouTube:', error);
    throw error;
  }
}

export async function getYouTubeToken(userId: string) {
  const docRef = doc(db, 'youtube_connections', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Conexão com YouTube não encontrada');
  }

  const data = docSnap.data();
  
  // Se o token expirou, tenta renovar usando o refresh token
  if (data.refreshToken && (!data.accessToken || isTokenExpired(data.expiresAt))) {
    try {
      const newToken = await refreshAccessToken(data.refreshToken);
      await setDoc(docRef, {
        accessToken: newToken.access_token,
        expiresAt: new Date(Date.now() + (newToken.expires_in * 1000)),
      }, { merge: true });
      
      return newToken.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Erro ao renovar token do YouTube');
    }
  }

  return data.accessToken;
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao renovar token');
  }

  return response.json();
}

function isTokenExpired(expiresAt: any): boolean {
  if (!expiresAt) return true;
  const expiry = new Date(expiresAt);
  return expiry.getTime() <= Date.now();
}