package speechsdk.quickstart;

import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.util.EventHandler;

/**
 * Quickstart: recognize speech using the Speech SDK for Java.
 */
public class Main {

    /**
     * @param args Arguments are ignored in this sample.
     */
    public static void main(String[] args) {
        try {
            // Replace below with your own subscription key
            String speechSubscriptionKey = "subscriptionkey";
            // Replace below with your own service region (e.g., "westus").
            String serviceRegion = "westus";

            SpeechConfig config = SpeechConfig.fromSubscription(speechSubscriptionKey, serviceRegion);       
            assert(config != null);
            config.setSpeechRecognitionLanguage("ja-JP");

            SpeechRecognizer reco = new SpeechRecognizer(config);
            assert(reco != null);
            
            reco.recognized.addEventListener(new EventHandler<SpeechRecognitionEventArgs>() {
            	@Override
            	public void onEvent(Object sender, SpeechRecognitionEventArgs e) {
            		System.out.println(e.getResult().getText());
            	}
            });

            System.out.println("Say something...");
            
            reco.speechEndDetected.addEventListener(new EventHandler<RecognitionEventArgs>() {

				@Override
				public void onEvent(Object sender, RecognitionEventArgs e) {
                    System.out.println("Detect speech end");
					
		            reco.close();
		            System.exit(0);
				}
            	
            });

            reco.canceled.addEventListener(new EventHandler<SpeechRecognitionCanceledEventArgs>(){
                @Override
                public void onEvent(Object sender, SpeechRecognitionCanceledEventArgs e) {
                    System.out.println("CANCELED: Reason=" + e.getReason());
                    if (e.getReason() == CancellationReason.Error) {
                        System.out.println("CANCELED: ErrorCode=" + e.getErrorCode());
                        System.out.println("CANCELED: ErrorDetails=" + e.getErrorDetails());
                        System.out.println("CANCELED: Did you update the subscription info?");

                        reco.close();
                        System.exit(1);
                    }
                }

            });
            reco.startContinuousRecognitionAsync();

        } catch (Exception ex) {
            System.out.println("Unexpected exception: " + ex.getMessage());

            assert(false);
            System.exit(1);
        }
    }
}