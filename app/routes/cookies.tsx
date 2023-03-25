import Container from "~/components/Container";

const blocks = [
  {
    heading: "What are cookies?",
    paragraph:
      "Cookies are small text files that are stored on your device when you visit a website.They allow the website to remember your preferences and actions, such as login details and language selection, over a period of time, so you don't have to keep re-entering them whenever you return to the site.",
  },
  {
    heading: "How we use cookies",
    paragraph:
      "We use cookies on our website to authenticate users and to keep track of their preferences and habits. Our cookies do not collect any personal information about you.",
  },
  {
    heading: "Managing cookies",
    paragraph:
      "You can delete cookies as you wish – for details, see aboutcookies.org. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.",
  },
  {
    heading: "Changes to this policy",
    paragraph:
      "We may update this Cookie Policy from time to time. When we do, we will revise the updated date at the top of this page. We encourage you to review this policy periodically to stay informed about how we use cookies.",
  },
  {
    heading: "Contact",
    paragraph:
      "If you have any questions about this Cookie Policy, please contact daniel@keone.dev",
  },
];

const CookiePolicy: React.FC = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold">We value your privacy</h1>
            <p>
              This Cookie Policy explains how we use cookies and similar
              technologies to enhance your experience on our website. By using
              our website, you consent to our use of cookies in accordance with
              this policy.
            </p>
          </div>
          {blocks.map(({ heading, paragraph }) => (
            <TextBlock key={heading} heading={heading} paragraph={paragraph} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CookiePolicy;

interface TextBlockProps {
  heading: string;
  paragraph: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ heading, paragraph }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-medium">{heading}</h2>
      <Paragraph text={paragraph} />
    </div>
  );
};

interface ParagraphProps {
  text: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ text }) => {
  return <p>{text}</p>;
};
