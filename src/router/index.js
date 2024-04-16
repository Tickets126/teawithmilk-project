import {createRouter, createWebHistory} from 'vue-router'
import keyWordsToExcel from '../components/keyWordsToExcel.vue'
import typesToExcel from '../components/typesToExcel.vue'
import placeNameToLonLat from '../components/placeNameToLonLat.vue'

const routes = [
    {
        path: '/',
        component: keyWordsToExcel
    },
    {
        path: '/typesToExcel',
        component: typesToExcel
    },
    {
        path: '/placeNameToLonLat',
        component: placeNameToLonLat
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
