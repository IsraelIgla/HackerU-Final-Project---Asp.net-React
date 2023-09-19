import { getValueFromDictionary } from "../components/Utilities"

function CookiePolicy() {
    return <div>

        <section className="band">
            <h1>Cookie Policy</h1>
            <p> {getValueFromDictionary('businessName')}</p>
            <p>This policy was last updated on: July 03, 2023<br /><br /><br /></p>
            <h3>INTRODUCTION</h3>

            <p>  {getValueFromDictionary('businessName')} or We provides this Website or Mobile App ("Site") for your use, subject to these Terms of Use and all applicable laws and regulations. Please read these Terms of Use carefully. By accessing and/or using the Site, you fully and unconditionally accept and agree to be bound by these Terms of Use, including binding arbitration. If you do not agree to these Terms of Use, please do not visit or use the Site.  {getValueFromDictionary('businessName')} reserves the right to revise these Terms of Use, so please check back periodically for changes. Your continued use of the Site following the posting of any changes to these Terms of Use constitutes your acceptance of those changes. All changes are effective immediately when We post them, and apply to use of the Site thereafter.</p>



            <p>
                The cookies we use allow our website to remember your preferences, improve the user experience and tailor the advertisements you see to those that are most relevant to you. These cookies refresh upon each website visit or to another site that recognises the cookie based on the categories described below.

                We also use other forms of technology which serve a similar purpose to cookies, such a pixel tags, and which allow us to monitor and improve our sites and mobile apps. When we talk about cookies in this Policy, this term includes these similar technologies.</p>



            <h3>Why Do We Use Cookies?</h3>

            <p>
                We use the following types of cookies:

                Strictly necessary cookies are used to allow you to navigate a website or mobile app and use its features such as accessing secure areas of the website or making a reservation. These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling out forms. You can set your browser or device settings to block or alert you about these cookies, but if you do so, some parts of the site or mobile application may not work. These cookies do not store any personally identifiable information. These types of cookies will expire within one year from your last website visit.

                Functional cookies  allow us to measure website usage and improve website and mobile app performance and customer experiences, such as remembering the choices you make and providing more personal features like storing your login account and language or geographic preferences. Depending on their function, some of these cookies may expire seven days after your last website visit, while others may remain persistently until they are deleted by you.

                Advertising cookies are used to deliver advertisements that are more relevant to you. Third parties that serve ads on our behalf use cookies to help select the ads that are displayed to you and ensure that you do not see the same ads repeatedly as well as to measure the effectiveness of advertising campaigns. Depending on their function, some of these cookies may expire thirty days after your last website visit, while others may remain persistently until they are deleted by you.

                For more information on targeted advertising, including about which third parties place these cookies and to learn how to opt out of them, visit our Cookie Consent Tool.

                Some newer web browsers incorporate "Do Not Track" features. Our websites may not currently respond to "Do Not Track" requests or headers from these browsers. To learn more about your options for not having this information used by certain service providers, visit our  Cookie Consent Tool. Opting out of this practice does not opt you out of being served generic advertising and you will continue to receive generic ads.

                For more information on how we process your personal data and to exercise your rights in relation to your personal data please consult our Privacy Policy.


            </p>


            <h3>How Can You Manage Cookies?</h3>


            <p>If you are viewing our content via a web browser, you can change your cookie preferences and withdraw your consent at any time using our Cookie Consent Tool. You always have the ability to manually delete cookies. If you are using our mobile apps, you can change your preferences in the analytics settings in the app.</p>

            <p>You may also set your browser to block all cookies or to indicate when a cookie is being set, although our services may not function properly if your cookies are disabled. To find out how to control or disable cookies within most browsers, consult the section of your browser .</p>

            <p>We adhere to the Digital Advertising Alliance's Self-Regulatory Principles for Online Behavioural Advertising.  To learn more or to opt out of online interest-based advertising by a list of companies participating, visit us for a list of companies participating in the DAA of Israel.</p>




        </section>
    </div>
}

export default CookiePolicy;