# Casos de Uso - Web

O diagrama registra os casos de uso web implementados. O destaque e a consulta
do proprio historico de avaliacoes realizadas pelo aluno.

```plantuml
@startuml
left to right direction

actor Aluno
actor Professor

rectangle EduQuest {
  usecase "Fazer login" as UCLogin
  usecase "Fazer avaliacao" as UCFazer
  usecase "Consultar avaliacoes\nrealizadas" as UCHistorico
  usecase "Criar avaliacao" as UCCriar
  usecase "Checar tentativas\ndos alunos" as UCTentativas
  usecase "Desativar avaliacao" as UCDesativar
  usecase "Consultar leaderboard" as UCLeaderboard
}

Aluno --> UCLogin
Aluno --> UCFazer
Aluno --> UCHistorico
Aluno --> UCLeaderboard

Professor --> UCLogin
Professor --> UCCriar
Professor --> UCTentativas
Professor --> UCDesativar
Professor --> UCLeaderboard

note right of UCHistorico
  Consulta somente tentativas
  do aluno autenticado.
end note
@enduml
```

O detalhamento tecnico desse caso esta em
[`07-consultar-avaliacoes-realizadas-aluno.md`](../07-consultar-avaliacoes-realizadas-aluno.md).
O leaderboard esta documentado em
[`11-consultar-leaderboard-aluno-professor.md`](../11-consultar-leaderboard-aluno-professor.md).
