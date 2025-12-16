import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
 
const CTASection = () => {
  const navigate = useNavigate()
  const handleStartTrial = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const handleRequestDemo = () => {
    window.location.href = "mailto:contact@veritasai.com?subject=Demo Request";
  };
 
  return (
    <section className="py-20 bg-feature-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading teams who are building faster, more reliable data pipelines. Start your free trial today and experience the future of data automation.
          </p>
 
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={()=>navigate("/auth")}
              className="bg-primary hover:bg-primary/90 h-12 px-8"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={()=> navigate("/auth")}
              className="h-12 px-8"
            >
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default CTASection;
 
 