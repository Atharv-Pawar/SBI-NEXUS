from typing import Dict, Any, List

class DigitalAdoptionAgent:
    def get_onboarding_guide(self, product_type: str) -> Dict[str, Any]:
        """
        Return structured step-by-step guides for different onboarding tasks
        """
        guides = {
            "yono_activation": {
                "title": "SBI YONO Activation Guide",
                "product": "SBI YONO App",
                "estimated_time": "5 minutes",
                "icon": "smartphone",
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Download and open the YONO SBI App, and tap on 'Existing SBI Customer'.",
                        "interactive_element": "existing_customer_button",
                        "hint": "Ensure your registered mobile SIM is active in this phone."
                    },
                    {
                        "step_number": 2,
                        "instruction": "Select 'Register with Account Details' and input your Account Number and Date of Birth.",
                        "interactive_element": "account_input_form",
                        "hint": "Your DOB should match your KYC documents."
                    },
                    {
                        "step_number": 3,
                        "instruction": "Enter the 6-digit OTP sent to your registered mobile number for authentication.",
                        "interactive_element": "otp_input",
                        "hint": "Never share your OTP with anyone, including bank staff."
                    },
                    {
                        "step_number": 4,
                        "instruction": "Select your branch details and confirm your transaction rights (Select 'Full Transaction Rights' for complete features).",
                        "interactive_element": "rights_select",
                        "hint": "Full rights are needed to create FDs and SIPs."
                    },
                    {
                        "step_number": 5,
                        "instruction": "Create a secure 6-digit MPIN for future logins. Your registration is complete!",
                        "interactive_element": "mpin_setup",
                        "hint": "Choose a memorable, non-sequential PIN (e.g. avoid 123456)."
                    }
                ]
            },
            "upi_setup": {
                "title": "SBI Pay UPI Registration Guide",
                "product": "SBI Pay (UPI)",
                "estimated_time": "2 minutes",
                "icon": "qr_code",
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Select the SIM card registered with SBI for automated verification.",
                        "interactive_element": "sim_select",
                        "hint": "This verification sends a secure SMS from your phone."
                    },
                    {
                        "step_number": 2,
                        "instruction": "Confirm your primary SBI Savings Account from the auto-detected list.",
                        "interactive_element": "account_confirm",
                        "hint": "Verify the last 4 digits of your account match."
                    },
                    {
                        "step_number": 3,
                        "instruction": "Enter the last 6 digits of your Debit Card and the Expiry Date (MM/YY).",
                        "interactive_element": "card_inputs",
                        "hint": "You will need your physical debit card handy."
                    },
                    {
                        "step_number": 4,
                        "instruction": "Create your secret 6-digit UPI PIN and re-enter it to confirm. Setup successful!",
                        "interactive_element": "upi_pin_inputs",
                        "hint": "This PIN will be required for every payment transaction."
                    }
                ]
            },
            "autopay_setup": {
                "title": "SBI AutoPay Mandate Activation Guide",
                "product": "SBI AutoPay",
                "estimated_time": "3 minutes",
                "icon": "repeat",
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Select 'Mandate Management' inside your YONO or Netbanking Portal, and click 'Create New Mandate'.",
                        "interactive_element": "create_mandate_button",
                        "hint": "Mandates automate transfers on a recurring basis."
                    },
                    {
                        "step_number": 2,
                        "instruction": "Input the Merchant details (e.g. SBI Mutual Fund, Electric Utility) and payment frequency (e.g. Monthly).",
                        "interactive_element": "merchant_select",
                        "hint": "Select your mutual fund folio or consumer number."
                    },
                    {
                        "step_number": 3,
                        "instruction": "Set the maximum amount limit and the validation end date for the auto-debits.",
                        "interactive_element": "mandate_details_form",
                        "hint": "Set the limit slightly higher than your usual bill."
                    },
                    {
                        "step_number": 4,
                        "instruction": "Confirm the mandate details and authorize using your Netbanking login credentials or ATM Card + OTP.",
                        "interactive_element": "auth_mandate",
                        "hint": "Auto-debits will initiate on the start date selected."
                    }
                ]
            }
        }
        
        return guides.get(product_type, {
            "title": "Onboarding Guide",
            "steps": [],
            "error": "Guide not found"
        })

adoption_agent = DigitalAdoptionAgent()
