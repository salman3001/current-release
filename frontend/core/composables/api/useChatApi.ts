export class useChatApi {
  static creatConversation() {
    const { fetch, loading } = usePostFetch();

    const createConversation = async (
      data: {
        userType: any;
        userId: number;
      },
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => {
      loading.value = true;
      try {
        const res = await fetch<IResType<IConversation>>(
          "/api/chat/conversations/",
          {
            method: "post",
            body: {
              participant: {
                ...data,
              },
            },
          }
        );

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      createConversation,
      loading,
    };
  }
}
