# Componente — GoogleLoginButton

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/GoogleLoginButton.tsx`

## O que faz

"Continuar com Google" + divisor "ou", para o topo de telas de login/cadastro. Carrega o Google Identity Services (GIS) sob demanda e entrega o ID token (`credential`) ao `onCredential` — quem chama repassa a [[funcoes/use-auth|useAuth]]`().loginWithGoogle`. Mesmo padrão do cidoa.

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `onCredential` | `(credential: string) => void` | sim | — | recebe o ID token do Google |
| `disabled` | `boolean` | não | `false` | trava o clique (ex.: enquanto envia) |

## Uso

```tsx
import { GoogleLoginButton } from '@/components/GoogleLoginButton'

<GoogleLoginButton onCredential={handleGoogle} disabled={submitting} />
```

## Notas

- `VITE_GOOGLE_CLIENT_ID` vazio → não renderiza nada (nem o "ou"). Mesmo valor do `GOOGLE_CLIENT_ID` do backend; registre a origem do front em *Origens JavaScript autorizadas* no Google Console.
- Visual: botão custom (`buttonVariants` outline + logo G) com o botão **real** do GIS invisível por cima — é ele que recebe o clique/teclado; o foco aparece pelo `focus-within` do wrapper.
- Script `accounts.google.com/gsi/client` só baixa quando o componente monta (promise única; falha libera nova tentativa). Sem o script (rede/bloqueador) o login por senha segue.
- GIS só aceita um `initialize` por página: fica em variável de módulo e o callback chama o `onCredential` do botão montado no momento.
- FedCM (`use_fedcm_for_button`) — navegador sem FedCM cai no popup.
