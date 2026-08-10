import { Injectable, Logger } from '@nestjs/common';
import { Mistral } from '@mistralai/mistralai';

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);
  private client: Mistral;

  constructor() {
    this.client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  }

  async genererResume(titre: string, auteur: string, description: string): Promise<string | null> {
    try {
      const prompt = `Tu es un assistant pour une librairie en ligne. Rédige un résumé accrocheur et concis (3-4 phrases maximum, en français) du livre suivant, destiné à donner envie de l'acheter. Ne réinvente pas l'histoire si tu ne la connais pas, base-toi uniquement sur les informations fournies.

Titre : ${titre}
Auteur : ${auteur}
Description existante : ${description}

Résumé :`;

      const response = await this.client.chat.complete({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
      });

      const contenu = response.choices?.[0]?.message?.content;
      return typeof contenu === 'string' ? contenu : null;
    } catch (error) {
      this.logger.error(`Erreur lors de la génération du résumé IA : ${error.message}`);
      return null;
    }
  }
}