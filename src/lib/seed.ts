import { db } from './db'
import { areas, topicos } from './schema'
import { AREAS } from './areas'

export async function seed() {
  console.log('Seeding database...')

  for (const area of AREAS) {
    // Inserir ou ignorar área
    const existing = await db.query.areas.findFirst({
      where: (a, { eq }) => eq(a.codigo, area.codigo),
    })

    let areaId: number

    if (!existing) {
      const result = await db.insert(areas).values({
        codigo: area.codigo,
        nome: area.nome,
        nivel: area.nivel,
        cor: area.cor,
        icone: area.icone,
      }).returning({ id: areas.id })
      areaId = result[0].id
      console.log(`  ✓ Área criada: ${area.nome}`)
    } else {
      areaId = existing.id
    }

    // Inserir tópicos que ainda não existem
    for (let i = 0; i < area.topicos.length; i++) {
      const nomeTopico = area.topicos[i]
      const existingTopico = await db.query.topicos.findFirst({
        where: (t, { eq, and }) => and(eq(t.areaId, areaId), eq(t.nome, nomeTopico)),
      })
      if (!existingTopico) {
        await db.insert(topicos).values({
          areaId,
          nome: nomeTopico,
          ordem: i,
        })
      }
    }
  }

  console.log('Seed concluído!')
}
