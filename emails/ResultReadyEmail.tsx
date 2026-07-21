import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export function ResultReadyEmail({ name }: { name: string }) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Seu resultado gratuito do Virada IA está pronto</Preview>
      <Body style={{ background: "#05070D", color: "#F7F8FC", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          <Heading style={{ color: "#5DFFB4" }}>Virada IA</Heading>
          <Section>
            <Text>Olá, {name}.</Text>
            <Text>
              Seu resultado gratuito está pronto. Ele mostra seu Índice de Virada, o principal ponto de bloqueio e uma
              ação imediata para começar.
            </Text>
            <Text>O plano completo permanece disponível dentro da plataforma.</Text>
          </Section>
          <Hr style={{ borderColor: "rgba(255,255,255,0.14)" }} />
          <Text style={{ color: "#A7B0C0", fontSize: 12 }}>
            Esta é uma análise educacional de hábitos e organização pessoal. Não substitui profissionais especializados.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
