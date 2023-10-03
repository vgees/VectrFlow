import { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import socketIOClient from 'socket.io-client'
import { cloneDeep } from 'lodash'
import rehypeMathjax from 'rehype-mathjax'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { CircularProgress, OutlinedInput, Divider, InputAdornment, IconButton, Box, Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconSend } from '@tabler/icons'

// project import
import { CodeBlock } from 'ui-component/markdown/CodeBlock'
import { MemoizedReactMarkdown } from 'ui-component/markdown/MemoizedReactMarkdown'
import SourceDocDialog from 'ui-component/dialog/SourceDocDialog'
import 'views/chatmessage/ChatMessage.css'

// api
import chatmessageApi from 'api/chatmessage'
import chatflowsApi from 'api/chatflows'
import predictionApi from 'api/prediction'

// Hooks
import useApi from 'hooks/useApi'

// Const
import { baseURL, maxScroll } from 'store/constant'

import robotPNG from 'assets/images/robot.png'
import userPNG from 'assets/images/account.png'
import { isValidURL } from 'utils/genericHelper'

function Compiler({ open, chatflowid, isDialog }) {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const ps = useRef()

    const [loading, setLoading] = useState(false)
    /*const [messages, setMessages] = useState([
        {
            message: 'Hi there! How can I help?',
            type: 'apiMessage'
        }
    ]) */

    const [userInput, setUserInput] = useState('')
    const [socketIOClientId, setSocketIOClientId] = useState('')
    const [isChatFlowAvailableToStream, setIsChatFlowAvailableToStream] = useState(false)
    const [sourceDialogOpen, setSourceDialogOpen] = useState(false)
    const [sourceDialogProps, setSourceDialogProps] = useState({})

    const inputRef = useRef(null)
    const getChatmessageApi = useApi(chatmessageApi.getChatmessageFromChatflow)
    const getIsChatflowStreamingApi = useApi(chatflowsApi.getIsChatflowStreaming)

    const addChatMessage = async (message, type, sourceDocuments) => {
        try {
            const newChatMessageBody = {
                role: type,
                content: message,
                chatflowid: chatflowid
            }
            if (sourceDocuments) newChatMessageBody.sourceDocuments = JSON.stringify(sourceDocuments)
            await chatmessageApi.createNewChatmessage(chatflowid, newChatMessageBody)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (userInput.trim() === '') {
            return
        }
        setUserInput('Hi')
        setLoading(true)
        // waiting for first chatmessage saved, the first chatmessage will be used in sendMessageAndGetPrediction
        await addChatMessage(userInput, 'userMessage')

        // Send user question and history to API
        try {
            const params = {
                question: userInput,
                history: messages.filter((msg) => msg.message !== 'Hi there! How can I help?')
            }
            if (isChatFlowAvailableToStream) params.socketIOClientId = socketIOClientId

            const response = await predictionApi.sendMessageAndGetPrediction(chatflowid, params)

            if (response.data) {
                let data = response.data

                data = handleVectaraMetadata(data)

                if (typeof data === 'object' && data.text && data.sourceDocuments) {
                    if (!isChatFlowAvailableToStream) {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { message: data.text, sourceDocuments: data.sourceDocuments, type: 'apiMessage' }
                        ])
                    }
                    addChatMessage(data.text, 'apiMessage', data.sourceDocuments)
                } else {
                    if (!isChatFlowAvailableToStream) {
                        setMessages((prevMessages) => [...prevMessages, { message: data, type: 'apiMessage' }])
                    }
                    addChatMessage(data, 'apiMessage')
                }
                setLoading(false)
                setUserInput('')
                setTimeout(() => {
                    inputRef.current?.focus()
                    scrollToBottom()
                }, 100)
            }
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            handleError(errorData)
            return
        }
    }

    return (
        <>
            <div className='center'>
                <div style={{ width: '100%' }}>
                    <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                        <OutlinedInput
                            inputRef={inputRef}
                            // eslint-disable-next-line
              autoFocus
                            sx={{ width: '100%' }}
                            disabled={loading || !chatflowid}
                            onKeyDown={handleEnter}
                            id='userInput'
                            name='userInput'
                            placeholder={loading ? 'Waiting for response...' : 'Type your question...'}
                            value={userInput}
                            onChange={onChange}
                            multiline={true}
                            maxRows={isDialog ? 7 : 2}
                            endAdornment={
                                <InputAdornment position='end' sx={{ padding: '15px' }}>
                                    <IconButton type='submit' disabled={loading || !chatflowid} edge='end'>
                                        {loading ? (
                                            <div>
                                                <CircularProgress color='inherit' size={20} />
                                            </div>
                                        ) : (
                                            // Send icon SVG in input field
                                            <IconSend
                                                color={loading || !chatflowid ? '#9e9e9e' : customization.isDarkMode ? 'white' : '#1e88e5'}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </form>
                </div>
            </div>
            <SourceDocDialog
        show={sourceDialogOpen}
        dialogProps={sourceDialogProps}
        onCancel={() => setSourceDialogOpen(false)}
  />
        </>
    )
}

export default compiler
