import { ref } from 'vue'
import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore'
import { driversDebtsService } from '../services/driversDebtsService'

export const useDriversDebts = () => {
    const data = ref(null)
    const error = ref(false)
    let message = ''

    const save = async (formData) => {
        error.value = false
        message = ''
        const { token } = useUserLoginStore()
        try {
            const response = await driversDebtsService.save(formData, { token })
            if (response.error) {
                error.value = true
                message = response.result.message || 'Error al guardar'
            } else {
                data.value = response.result.data
                message = 'Registro guardado correctamente'
            }
        } catch (e) {
            error.value = true
            message = e.message || 'Error inesperado'
        }
    }

    const update = async (id, formData) => {
        error.value = false
        message = ''
        const { token } = useUserLoginStore()
        try {
            const response = await driversDebtsService.update(id, formData, { token })
            if (response.error) {
                error.value = true
                message = response.result.message || 'Error al actualizar'
            } else {
                data.value = response.result.data
                message = 'Registro actualizado correctamente'
            }
        } catch (e) {
            error.value = true
            message = e.message || 'Error inesperado'
        }
    }

    const query = async (params = null) => {
        error.value = false
        message = ''
        const { token } = useUserLoginStore()
        try {
            const response = await driversDebtsService.query(params, { token })
            if (response.error) {
                error.value = true
                message = response.result.message || 'Error al consultar'
            } else {
                data.value = response.result.data
                message = 'Consulta exitosa'
            }
        } catch (e) {
            error.value = true
            message = e.message || 'Error inesperado'
        }
    }

    const remove = async (id) => {
        error.value = false
        message = ''
        const { token } = useUserLoginStore()
        try {
            const response = await driversDebtsService.remove(id, { token })
            if (response.error) {
                error.value = true
                message = response.result.message || 'Error al eliminar'
            } else {
                data.value = response.result.data
                message = 'Registro eliminado correctamente'
            }
        } catch (e) {
            error.value = true
            message = e.message || 'Error inesperado'
        }
    }

    return { data, error, message, save, update, query, remove }
}
