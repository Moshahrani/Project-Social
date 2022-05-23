import App from "next/app";
import "semantic-ui-css/semantic.min.css";

class MyApp extends App {
    render() {
        const { Component } = this.props;
        
        return (
            <Layout>
             <Component />
            </Layout>
        );
    }
}

export default MyApp;

