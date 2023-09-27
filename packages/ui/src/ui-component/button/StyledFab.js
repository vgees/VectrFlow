import { styled } from '@mui/material/styles'
import { Fab } from '@mui/material'

export const StyledFab = styled(Fab)(({ theme }) => ({
    color: 'white',
    background: 'linear-gradient(60deg, #3864B3, #2F5597, #EC73FF)',
    '&:hover': {
        background: 'linear-gradient(60deg, #EC73FF, #2F5597, #3864B3)'
    }
}))

/*
export const StyledFab = styled(Fab)(({ theme, color = 'primary' }) => ({
    color: 'white',
    backgroundColor: theme.palette[color].main,
    '&:hover': {
        backgroundColor: theme.palette[color].main,
        backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
    }
}))
*/
