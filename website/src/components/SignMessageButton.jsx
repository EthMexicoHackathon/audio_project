import { useSignMessage } from "wagmi";

function SignMessageButton() {
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: "gm wagmi frens",
    onSuccess: (signedMessage) => {
      console.log("success");
      console.log(signedMessage);
    },
    onError: (error) => {
      console.log("error");
      console.log(error);
    },
  });

  return (
    <div>
      <button disabled={isLoading} onClick={() => signMessage()}>
        Sign message
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
}

export default SignMessageButton;
