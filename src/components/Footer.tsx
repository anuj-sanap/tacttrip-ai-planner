import { GraduationCap, Rocket, MessageCircle, Mic, CreditCard } from 'lucide-react';

const Footer = () => {
  const futureFeatures = [
    { icon: MessageCircle, text: 'AI Chat Assistant for real-time travel queries' },
    { icon: CreditCard, text: 'Real-time booking integration with payment' },
    { icon: Mic, text: 'Voice-based travel planning interface' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        {/* Future Scope Section */}
        <div className="mb-8 p-6 rounded-xl bg-secondary/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-primary" />
            Future Scope
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {futureFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Credit */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">Academic Project</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Department of Computer Engineering
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            TactTrip – AI Travel Agent © 2024. Built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
