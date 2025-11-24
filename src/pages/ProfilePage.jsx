import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, User, Mail, Lock, Edit2, Save, X, AtSign } from 'lucide-react';
import Navbar from '../components/navbar';
import { obtener_perfil, actualizar_perfil } from '../herramientas/perfil';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await obtener_perfil();
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      setUser(response.user);
      setFormData({
        nombre: response.user.nombre || '',
        email: response.user.email || '',
        username: response.user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.message || 'Error al cargar el perfil');
      setMessage({ type: 'error', text: error.message || 'Error al cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.nombre || !formData.email || !formData.username) {
      const errorMsg = 'Todos los campos son obligatorios';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      const errorMsg = 'Las contraseñas nuevas no coinciden';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      const errorMsg = 'La contraseña debe tener al menos 6 caracteres';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      const errorMsg = 'Debes ingresar tu contraseña actual para cambiarla';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    try {
      setSaving(true);
      
      const response = await actualizar_perfil({
        nombre: formData.nombre,
        email: formData.email,
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      setUser(response.user);
      setFormData(prev => ({
        nombre: response.user.nombre,
        email: response.user.email,
        username: response.user.username,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      const successMsg = response.message || '¡Perfil actualizado exitosamente!';
      setMessage({ type: 'success', text: successMsg });
      toast.success(successMsg);
      setIsEditing(false);
    } catch (error) {
      const errorMsg = error.message || 'Error al actualizar el perfil';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      username: user.username || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Mi Perfil</h1>
                    <p className="text-blue-100">Administra tu información de cuenta</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mx-6 mt-6 p-4 rounded-lg flex items-start space-x-3 ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p>{message.text}</p>
              </div>
            )}

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                  <span className="text-xs text-gray-500 ml-2">(máx. 18 caracteres)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    maxLength={18}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Role Display (Read-only) */}
              {user && user.role && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500">
                    {user.role}
                  </div>
                </div>
              )}

              {/* Password Change Section */}
              {isEditing && (
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h3>
                  <p className="text-sm text-gray-600">Deja en blanco si no deseas cambiar tu contraseña</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Requerida para cambiar contraseña"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Repite la nueva contraseña"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}