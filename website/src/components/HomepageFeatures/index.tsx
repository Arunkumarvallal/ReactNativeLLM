import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🤖 Local AI Models',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Download and run Large Language Models directly on your mobile device. 
        No internet required after download, ensuring complete privacy and offline functionality.
      </>
    ),
  },
  {
    title: '🧠 Context-Aware Conversations',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Intelligent context integration from markdown files enables personalized AI responses 
        based on your specific information, projects, and preferences.
      </>
    ),
  },
  {
    title: '🎨 Beautiful & Customizable',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Modern, responsive design with dark/light theme support. 
        Built with React Native and TypeScript for a smooth, native experience.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        <div className="row" style={{marginTop: '4rem'}}>
          <div className="col col--12">
            <div className="text--center">
              <Heading as="h2">Why ReactNativeLLM?</Heading>
              <div className="row" style={{marginTop: '2rem'}}>
                <div className="col col--6">
                  <div className={styles.feature}>
                    <h3>🔒 Privacy First</h3>
                    <p>
                      All conversations happen locally on your device. No data is sent to external servers, 
                      ensuring complete privacy and security for your interactions.
                    </p>
                  </div>
                </div>
                <div className="col col--6">
                  <div className={styles.feature}>
                    <h3>📱 Mobile Optimized</h3>
                    <p>
                      Built specifically for mobile devices with optimized performance, 
                      responsive design, and efficient resource usage.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="row" style={{marginTop: '2rem'}}>
                <div className="col col--6">
                  <div className={styles.feature}>
                    <h3>⚡ Offline Capable</h3>
                    <p>
                      Once models are downloaded, no internet connection is required. 
                      Perfect for use anywhere, anytime.
                    </p>
                  </div>
                </div>
                <div className="col col--6">
                  <div className={styles.feature}>
                    <h3>🛠️ Developer Friendly</h3>
                    <p>
                      Open source, well-documented, and built with modern React Native practices. 
                      Easy to customize and extend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row" style={{marginTop: '4rem'}}>
          <div className="col col--12">
            <div className="text--center">
              <Heading as="h2">Quick Start</Heading>
              <p style={{fontSize: '1.1rem', marginBottom: '2rem'}}>
                Get ReactNativeLLM running in just a few minutes:
              </p>
              
              <div className={styles.quickStart}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Clone & Install</h4>
                    <p>Clone the repository and install dependencies</p>
                    <code>git clone https://github.com/your-username/ReactNativeLLM.git</code>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Run the App</h4>
                    <p>Start the development server and run on your device</p>
                    <code>npm install && npm run ios</code>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Download Models</h4>
                    <p>Select and download your first AI model to start chatting</p>
                    <code>Select model → Download → Chat!</code>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '3rem'}}>
                <Link
                  className="button button--primary button--lg"
                  to="/docs/installation">
                  View Installation Guide
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  to="/docs/getting-started/quick-start"
                  style={{marginLeft: '1rem'}}>
                  Quick Start Tutorial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}