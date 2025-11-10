import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getToken, saveToken, removeToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { isCliente, isAdmin, getClienteProfile, createClienteProfile } from "../services/clienteAuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const setToken = (newToken, userData = null) => {
    console.log('🔐 setToken called with:', { newToken: newToken ? 'Token received' : 'No token', userData });
    
    if (newToken) {
      console.log('✅ Saving token to storage:', newToken.substring(0, 20) + '...');
      saveToken(newToken);
      setTokenState(newToken);
      setUser(userData);
    } else {
      console.log('❌ Removing token from storage');
      removeToken();
      setTokenState(null);
      setUser(null);
    }
  };

  // Login con redirección automática según el rol
  const loginWithRedirect = async (userData, returnPath = null) => {
    console.log('🔐 loginWithRedirect recibió:', userData);
    
    if (userData && userData.token) {
      // Establecer token y datos de usuario
      setToken(userData.token, userData.user || userData);
      
      // Actualizar estado del usuario con todos los datos recibidos
      setUser(userData.user || userData);
      
      // Redirigir según el rol
      const userToCheck = userData.user || userData;
      if (isAdmin(userToCheck)) {
        navigate("/dashboard");
      } else if (isCliente(userToCheck)) {
        // Si viene de una página específica, regresar ahí, sino al catálogo
        navigate(returnPath || "/catalogo");
      }
    }
  };

  // Verificar si está logueado
  const isLoggedIn = () => {
    return !!token;
  };

  // Verificar solo el token (más permisivo)
  const hasValidToken = () => {
    const hasToken = !!token;
    console.log("🔑 Token check:", hasToken);
    return hasToken;
  };

  // Verificar si es cliente logueado
  const isClienteLoggedIn = () => {
    const hasToken = !!token;
    const hasUser = !!user;
    
    // Si tenemos token pero no user, asumir que es válido
    // (puede pasar si loadUserProfile falla pero el login fue exitoso)
    if (hasToken && !hasUser) {
      console.log("🔐 Auth check - Token válido, user data no disponible, asumiendo sesión válida");
      return true;
    }
    
    const isClienteRole = user && isCliente(user);
    
    console.log("🔐 Auth check - Token:", hasToken, "User:", hasUser, "Is Cliente:", isClienteRole);
    console.log("🔐 User data:", user);
    
    return hasToken && (hasUser ? isClienteRole : true);
  };

  // Verificar si es admin logueado
  const isAdminLoggedIn = () => {
    return isLoggedIn() && user && isAdmin(user);
  };

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  // Cargar perfil del usuario desde el servidor
  const loadUserProfile = useCallback(async () => {
    try {
      console.log('🔄 Intentando cargar perfil del usuario...');
      const profileData = await getClienteProfile();
      console.log('✅ Perfil cargado exitosamente:', profileData);
      setUser(profileData);
    } catch (error) {
      console.warn('⚠️ Error cargando perfil del usuario:', error);
      // NO cerrar sesión automáticamente - solo loggear el error
      // El usuario puede seguir usando la app con los datos básicos del login
    }
  }, []);

  // Crear perfil de cliente
  const createClientProfile = async (clienteData) => {
    try {
      console.log('📝 Creando perfil de cliente...', clienteData);
      const profileData = await createClienteProfile(clienteData);
      console.log('✅ Perfil de cliente creado exitosamente:', profileData);
      
      // Actualizar el estado del usuario con el nuevo perfil
      setUser(prevUser => ({
        ...prevUser,
        clienteProfile: profileData
      }));
      
      return profileData;
    } catch (error) {
      console.error('❌ Error creando perfil de cliente:', error);
      throw error;
    }
  };

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      console.log('🔑 Token encontrado en localStorage, restaurando sesión...');
      setTokenState(stored);
      // Nota: No cargar perfil automáticamente aquí
      // El perfil se carga después del login explícito
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      setToken, 
      loginWithRedirect,
      logout,
      isLoggedIn,
      hasValidToken,
      isClienteLoggedIn,
      isAdminLoggedIn,
      loadUserProfile,
      createClientProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
