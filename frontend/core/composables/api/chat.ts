export const useCreatChat = async (data: {
    userType: any,
    userId: number
}) => {
    const { fetch: createChat, loading } = usePostFetch()

    try {
        const res = await createChat<IResType<IConversation>>(apiRoutes.chat.conversations.create, {
            method: 'post',
            body: {
                participant: {
                    ...data
                }
            }
        })

        if (res.success == true) {
            navigateTo({
                path: routes.chats, query: {
                    newConversationId: res?.data?.id
                }
            })
        }
    } catch (error) {
        console.log(error)
    }


}